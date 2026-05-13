import { state, navigate } from '../state.js';
import { renderHeader, attachHeaderListeners } from '../components/Header.js';
import { bookings, cottages, addons, users } from '../api.js';

export function renderInspector() {
  return `
    <div class="max-w-4xl mx-auto px-4 py-8">
      ${renderHeader("Access Scan", "Digital pass verification system")}

      <!-- Settings Button (floating) -->
      <div class="max-w-xl mx-auto flex justify-end mb-4">
        <button id="openSettingsPanel" class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Settings
        </button>
      </div>

      <div class="max-w-xl mx-auto space-y-8 animate-fade-in">
        <!-- Scanner Interface -->
        <div id="scannerContainer" class="relative group">
           <div class="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
           <div class="relative glass p-3 rounded-[3rem] overflow-hidden aspect-square shadow-2xl bg-black">
              <video id="scanVideo" class="w-full h-full object-cover rounded-[2.5rem] opacity-100" muted playsinline></video>
              
              <!-- Start Camera Overlay -->
              <div id="startCameraOverlay" class="absolute inset-0 flex flex-col items-center justify-center rounded-[2.5rem] bg-black/80 backdrop-blur-sm cursor-pointer group z-10">
                 <div class="w-20 h-20 rounded-full bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-all group-hover:bg-teal-500/40">
                   <svg class="w-10 h-10 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                 </div>
                 <span class="text-white font-black text-sm uppercase tracking-widest">Tap to Start Camera</span>
                 <span class="text-white/40 font-bold text-xs mt-1">Allow camera access when prompted</span>
              </div>
              
              <!-- Scanning HUD -->
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div class="w-64 h-64 border-2 border-white/20 rounded-[2rem] relative">
                    <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-teal-400 rounded-tl-xl"></div>
                    <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-teal-400 rounded-tr-xl"></div>
                    <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-teal-400 rounded-bl-xl"></div>
                    <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-teal-400 rounded-br-xl"></div>
                    
                    <!-- Scan Line Animation -->
                    <div class="absolute left-0 right-0 h-1 bg-teal-400/50 shadow-[0_0_15px_rgba(45,212,191,0.5)] animate-scan-line"></div>
                 </div>
              </div>
              
              <div class="absolute bottom-10 left-0 right-0 text-center">
                 <span class="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full text-white text-xs font-black uppercase tracking-[0.2em] border border-white/10">Align QR Code</span>
              </div>
           </div>
           <canvas id="scanCanvas" class="hidden"></canvas>
        </div>
        
        <!-- Result Display -->
        <div id="scanResult" class="glass p-10 rounded-[3rem] text-center hidden border border-white/40 shadow-3xl animate-scale-up">
           <div id="statusIcon" class="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl transform scale-110">
              <!-- Icon will be injected -->
           </div>
           <h3 id="statusTitle" class="text-3xl font-black text-slate-900 mb-2">Status</h3>
           <p class="text-slate-400 font-mono text-sm mb-8 tracking-widest" id="resultId"></p>
           
           <div id="resultDetails" class="bg-slate-50/80 p-6 rounded-[2rem] text-left space-y-4 mb-8 hidden border border-slate-100">
              <div class="flex justify-between items-center pb-3 border-b border-slate-200">
                <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Customer</span>
                <span class="font-bold text-slate-900" id="resName">Unknown</span>
              </div>
              <div class="flex justify-between items-center pb-3 border-b border-slate-200">
                <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Reserved Unit</span>
                <span class="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 font-black text-xs" id="resCottage">#0</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs font-black text-slate-400 uppercase tracking-widest">Validity</span>
                <span class="font-black text-emerald-500" id="resDate">Today</span>
              </div>
           </div>
           
           <button id="resetScan" class="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-slate-900/20">Resume Scanner</button>
        </div>

        <!-- Manual Lookup Section -->
        <div class="glass p-8 rounded-[3rem] border border-white/40 shadow-xl space-y-6">
           <div class="flex items-center gap-4 mb-2">
              <div class="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <div>
                <h4 class="text-lg font-black text-slate-900 tracking-tight">Manual Lookup</h4>
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Search by Name or Booking ID</p>
              </div>
           </div>
           
           <div class="relative">
              <input type="text" id="manualSearchInput" class="w-full bg-white/50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-slate-900 transition-all outline-none" placeholder="Enter Name or TRX-ID...">
              <div id="manualSearchResults" class="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100] hidden max-h-60 overflow-y-auto">
                 <!-- Results will be injected here -->
              </div>
           </div>
        </div>

        <div class="flex justify-center gap-8 text-slate-400">
           <div class="flex flex-col items-center gap-2">
             <div class="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
             </div>
             <span class="text-[10px] font-black uppercase tracking-widest">Encrypted</span>
           </div>
           <button id="openWalkinModal" class="flex flex-col items-center gap-2 group">
             <div class="w-12 h-12 rounded-2xl bg-slate-900 text-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-all">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
             </div>
             <span class="text-[10px] font-black text-slate-900 uppercase tracking-widest">Walk-in</span>
           </button>
           <div class="flex flex-col items-center gap-2">
             <div class="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-teal-500">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
             </div>
             <span class="text-[10px] font-black uppercase tracking-widest">Real-time</span>
           </div>
        </div>

        <!-- Walk-in Modal -->
        <div id="walkinModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[500] hidden flex items-center justify-center p-4 md:p-6">
          <div class="bg-white w-full max-w-2xl rounded-[3rem] p-8 md:p-12 shadow-3xl animate-scale-up max-h-[90vh] overflow-y-auto border-2 border-white">
            <h3 class="text-4xl font-black text-slate-900 mb-8 tracking-tighter italic">Walk-in Booking.</h3>
            <form id="walkinForm" class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-6">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Customer Name</label>
                  <input type="text" id="walkinName" class="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-slate-900 transition-all" placeholder="e.g. John Doe" required>
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Booking Date</label>
                  <input type="date" id="walkinDate" class="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-slate-900 transition-all" required value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Cottage Selection</label>
                  <select id="walkinCottage" class="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 text-sm font-bold focus:ring-2 focus:ring-slate-900 transition-all" required>
                    <option value="">Select a Cottage</option>
                    ${state.cottages.filter(c => c.active).map(c => `
                      <option value="${c.id}" data-price="${c.price}">#${c.id} - ${c.category} (₱${c.price})</option>
                    `).join('')}
                  </select>
                </div>
              </div>
              
              <div class="space-y-6">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Add-ons</label>
                  <div class="grid grid-cols-1 gap-3">
                    ${state.addons.map(a => `
                      <label class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all">
                        <div class="flex items-center gap-3">
                          <input type="checkbox" name="walkinAddon" value="${a.name}" data-price="${a.price}" class="w-5 h-5 rounded-lg border-slate-200 text-slate-900 focus:ring-slate-900">
                          <span class="text-xs font-bold text-slate-700">${a.name}</span>
                        </div>
                        <span class="text-[10px] font-black text-slate-400">₱${a.price}</span>
                      </label>
                    `).join('')}
                  </div>
                </div>
                
                <div class="bg-slate-900 p-8 rounded-[2rem] text-white space-y-4 shadow-xl">
                   <div class="flex justify-between items-center opacity-50">
                      <span class="text-[9px] font-black uppercase tracking-widest">Base Rate</span>
                      <span id="walkinBaseTotal" class="text-xs font-black">₱0</span>
                   </div>
                   <div class="flex justify-between items-center opacity-50">
                      <span class="text-[9px] font-black uppercase tracking-widest">Add-ons</span>
                      <span id="walkinAddonTotal" class="text-xs font-black">₱0</span>
                   </div>
                   <div class="pt-4 border-t border-white/10 flex justify-between items-center">
                      <span class="text-[10px] font-black uppercase tracking-[0.2em]">Grand Total</span>
                      <span id="walkinGrandTotal" class="text-2xl font-black tracking-tighter text-emerald-400">₱0</span>
                   </div>
                </div>
              </div>

              <div class="md:col-span-2 flex gap-4 pt-6">
                <button type="button" id="closeWalkinModal" class="flex-1 py-5 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
                <button type="submit" class="flex-1 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all">Confirm Walk-in</button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>

    <!-- Settings Modal (completely separate from scanner) -->
    <div id="inspectorSettingsModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[600] hidden flex items-center justify-center p-4">
      <div class="bg-white w-full max-w-lg rounded-[3rem] shadow-3xl animate-scale-up max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-8 pb-0">
          <div>
            <h2 class="text-4xl font-black text-black tracking-tighter italic">Settings.</h2>
            <p class="text-[10px] font-black text-black/40 uppercase tracking-[0.4em] mt-1">Update your account</p>
          </div>
          <button id="closeSettingsPanel" class="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all">
            <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Settings Form -->
        <form id="inspectorSettingsForm" class="p-8 space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-black/40 uppercase tracking-widest ml-1">Full Name</label>
              <input type="text" name="name" value="${state.user?.name || ''}" class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-black focus:border-black outline-none transition-all" required>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-black/40 uppercase tracking-widest ml-1">Phone</label>
              <input type="text" name="phone" value="${state.user?.phone || ''}" class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-black focus:border-black outline-none transition-all" placeholder="09123456789">
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black text-black/40 uppercase tracking-widest ml-1">Email (Gmail)</label>
            <input type="email" name="email" value="${state.user?.email || ''}" class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-black focus:border-black outline-none transition-all" required>
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black text-black/40 uppercase tracking-widest ml-1">New Password (leave blank to keep current)</label>
            <input type="password" name="password" placeholder="••••••••" class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-black focus:border-black outline-none transition-all">
          </div>

          <div id="settingsMsg" class="hidden text-center text-sm font-bold rounded-2xl px-4 py-3"></div>

          <button type="submit" class="w-full py-5 bg-black text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all shadow-xl active:scale-95">Save Changes</button>
        </form>
      </div>
    </div>
  `;
}

export function attachInspectorListeners(renderFn) {
  attachHeaderListeners(renderFn);

  // --- Settings Modal Logic ---
  const settingsModal = document.getElementById('inspectorSettingsModal');
  const openBtn = document.getElementById('openSettingsPanel');
  const closeBtn = document.getElementById('closeSettingsPanel');
  const settingsForm = document.getElementById('inspectorSettingsForm');
  const settingsMsg = document.getElementById('settingsMsg');

  if (openBtn) openBtn.onclick = () => settingsModal.classList.remove('hidden');
  if (closeBtn) closeBtn.onclick = () => settingsModal.classList.add('hidden');
  // Close on backdrop click
  if (settingsModal) settingsModal.onclick = (e) => {
    if (e.target === settingsModal) settingsModal.classList.add('hidden');
  };

  if (settingsForm) {
    settingsForm.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(settingsForm);
      const email = fd.get('email');
      const name = fd.get('name');
      const phone = fd.get('phone');
      const password = fd.get('password');

      const showMsg = (text, ok) => {
        settingsMsg.textContent = text;
        settingsMsg.className = `text-center text-sm font-bold rounded-2xl px-4 py-3 ${ok ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`;
        settingsMsg.classList.remove('hidden');
        setTimeout(() => settingsMsg.classList.add('hidden'), 4000);
      };

      try {
        const res = await users.updateProfile({ email, name, phone, password });
        showMsg('✓ ' + res.data.message, true);
        state.user.email = email;
        state.user.name = name;
        state.user.phone = phone;
        settingsForm.querySelector('input[name="password"]').value = '';
      } catch (err) {
        showMsg('✗ ' + (err.response?.data?.error || 'Update failed'), false);
      }
    };
  }

  // --- Scanner Logic (completely independent) ---
  const video = document.getElementById('scanVideo');
  const canvas = document.getElementById('scanCanvas');
  const overlay = document.getElementById('startCameraOverlay');
  let scanning = true;
  let cameraStarted = false;

  function tick() {
    if (!scanning || !video || !canvas) return;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = typeof jsQR !== 'undefined' ? jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      }) : null;
      if (code) {
        handleScan(code.data);
        return;
      }
    }
    requestAnimationFrame(tick);
  }

  const startCamera = async () => {
    if (cameraStarted) return;
    cameraStarted = true;
    if (overlay) overlay.innerHTML = `
      <div class="text-center p-8">
        <div class="w-16 h-16 rounded-full border-2 border-teal-400/50 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg class="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
        </div>
        <span class="text-white font-black text-sm uppercase tracking-widest">Starting Camera...</span>
      </div>`;

    const showError = () => {
      cameraStarted = false;
      if (overlay) {
        overlay.classList.remove('hidden');
        overlay.innerHTML = `
          <div class="text-center p-8 space-y-3">
            <svg class="w-12 h-12 text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
            <p class="text-red-400 font-black text-sm uppercase tracking-widest">Camera Access Denied</p>
            <p class="text-white/60 text-xs leading-relaxed">Click the 🔒 lock icon in your browser address bar → set Camera to <b class="text-white">Allow</b> → then refresh the page.</p>
            <button onclick="location.reload()" class="mt-4 px-6 py-2 bg-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-teal-600 transition-all">Refresh Page</button>
          </div>`;
      }
    };

    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
      if (overlay) overlay.classList.add('hidden');
      video.srcObject = stream;
      await video.play();
      requestAnimationFrame(tick);
    } catch (err) {
      console.error('Camera failed:', err);
      showError();
    }
  };

  // Start camera on overlay click (required by browser policy)
  if (overlay) overlay.onclick = startCamera;

  function handleScan(data) {
    scanning = false;
    const resultDiv = document.getElementById('scanResult');
    const scannerDiv = document.getElementById('scannerContainer');
    const statusIcon = document.getElementById('statusIcon');
    const details = document.getElementById('resultDetails');
    
    resultDiv.classList.remove('hidden');
    scannerDiv.classList.add('hidden');
    document.getElementById('resultId').innerText = data;

    const booking = state.bookings.find(b => b.id === data);

    if (booking) {
       const isConfirmed = booking.status === 'Confirmed';
       statusIcon.className = `w-24 h-24 ${isConfirmed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'} rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl transform scale-110`;
       statusIcon.innerHTML = isConfirmed 
         ? `<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"></path></svg>`
         : `<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
       
       document.getElementById('statusTitle').innerText = isConfirmed ? "Access Granted" : "Payment Pending";
       document.getElementById('statusTitle').className = `text-3xl font-black ${isConfirmed ? 'text-emerald-600' : 'text-amber-600'} mb-2`;
       
       const displayName = booking.walkin_name || (booking.userName ? booking.userName : `User ID: ${booking.userId}`);
       document.getElementById('resName').innerText = displayName;
       document.getElementById('resCottage').innerText = `#${booking.cottageId}`;
       document.getElementById('resDate').innerText = booking.date;
       details.classList.remove('hidden');
    } else {
       statusIcon.className = "w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl transform scale-110";
       statusIcon.innerHTML = `<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M6 18L18 6M6 6l12 12"></path></svg>`;
       document.getElementById('statusTitle').innerText = "Access Denied";
       details.classList.add('hidden');
    }
  }

  document.getElementById('resetScan').onclick = () => {
    scanning = true;
    document.getElementById('scanResult').classList.add('hidden');
    document.getElementById('scannerContainer').classList.remove('hidden');
    requestAnimationFrame(tick); // Resume scanning loop
  };

  // Manual Search Logic
  const searchInput = document.getElementById('manualSearchInput');
  const resultsDiv = document.getElementById('manualSearchResults');

  if (searchInput) {
    searchInput.oninput = () => {
      const query = searchInput.value.trim().toLowerCase();
      if (!query) {
        resultsDiv.classList.add('hidden');
        return;
      }
      const matches = state.bookings.filter(b => {
        const name = b.walkin_name || b.userName || '';
        return b.id.toLowerCase().includes(query) || name.toLowerCase().includes(query);
      }).slice(0, 5);

      if (matches.length > 0) {
        resultsDiv.innerHTML = matches.map(b => {
          const name = b.walkin_name || b.userName || 'Unknown';
          return `
            <div class="search-result-item p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0" data-id="${b.id}">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-[10px] font-black text-slate-900 uppercase tracking-widest">${b.id}</p>
                  <p class="text-sm font-bold text-slate-600">${name}</p>
                </div>
                <span class="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}">
                  ${b.status}
                </span>
              </div>
            </div>
          `;
        }).join('');
        resultsDiv.classList.remove('hidden');
        document.querySelectorAll('.search-result-item').forEach(item => {
          item.onclick = () => {
            const id = item.dataset.id;
            searchInput.value = id;
            resultsDiv.classList.add('hidden');
            handleScan(id);
          };
        });
      } else {
        resultsDiv.innerHTML = `<div class="p-4 text-center text-xs font-bold text-slate-300 italic">No matches found</div>`;
        resultsDiv.classList.remove('hidden');
      }
    };
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !resultsDiv.contains(e.target)) {
        resultsDiv.classList.add('hidden');
      }
    });
  }

  // Walk-in Booking Listeners
  const openWalkinModal = document.getElementById('openWalkinModal');
  const walkinModal = document.getElementById('walkinModal');
  const closeWalkinModal = document.getElementById('closeWalkinModal');
  const walkinForm = document.getElementById('walkinForm');

  if (openWalkinModal) openWalkinModal.onclick = () => walkinModal.classList.remove('hidden');
  if (closeWalkinModal) closeWalkinModal.onclick = () => walkinModal.classList.add('hidden');

  const updateWalkinTotal = () => {
    const cottageSelect = document.getElementById('walkinCottage');
    const selectedDate = document.getElementById('walkinDate').value;
    const selectedOption = cottageSelect.options[cottageSelect.selectedIndex];
    
    const bookedCottageIds = state.bookings
      .filter(b => b.date === selectedDate && b.status !== 'Cancelled')
      .map(b => parseInt(b.cottageId));

    Array.from(cottageSelect.options).forEach(opt => {
      if (opt.value === "") return;
      const id = parseInt(opt.value);
      if (bookedCottageIds.includes(id)) {
        opt.disabled = true;
        opt.textContent = `${opt.textContent.split(' (')[0]} (BOOKED)`;
        opt.classList.add('text-slate-300');
      } else {
        opt.disabled = false;
        const originalCottage = state.cottages.find(c => c.id == id);
        if (originalCottage) {
          opt.textContent = `#${id} - ${originalCottage.category} (₱${originalCottage.price.toLocaleString()})`;
        }
        opt.classList.remove('text-slate-300');
      }
    });

    const basePrice = parseInt(selectedOption?.dataset?.price || 0);
    let addonPrice = 0;
    document.querySelectorAll('input[name="walkinAddon"]:checked').forEach(cb => {
      addonPrice += parseInt(cb.dataset.price || 0);
    });

    document.getElementById('walkinBaseTotal').innerText = `₱${basePrice.toLocaleString()}`;
    document.getElementById('walkinAddonTotal').innerText = `₱${addonPrice.toLocaleString()}`;
    document.getElementById('walkinGrandTotal').innerText = `₱${(basePrice + addonPrice).toLocaleString()}`;
  };

  if (walkinForm) {
    document.getElementById('walkinDate').onchange = updateWalkinTotal;
    document.getElementById('walkinCottage').onchange = updateWalkinTotal;
    document.querySelectorAll('input[name="walkinAddon"]').forEach(cb => {
      cb.onchange = updateWalkinTotal;
    });

    walkinForm.onsubmit = async (e) => {
      e.preventDefault();
      const addonsList = [];
      document.querySelectorAll('input[name="walkinAddon"]:checked').forEach(cb => {
        addonsList.push(cb.value);
      });

      const cottageSelect = document.getElementById('walkinCottage');
      const basePrice = parseInt(cottageSelect.options[cottageSelect.selectedIndex].dataset.price);
      const addonTotal = addonsList.reduce((sum, name) => {
        const a = state.addons.find(ad => ad.name === name);
        return sum + (a ? a.price : 0);
      }, 0);

      const bookingData = {
        walkinName: document.getElementById('walkinName').value,
        date: document.getElementById('walkinDate').value,
        cottageId: parseInt(cottageSelect.value),
        addons: addonsList,
        total: basePrice + addonTotal,
        paymentMethod: 'Cash (Walk-in)',
        status: 'Confirmed'
      };

      try {
        await bookings.create(bookingData);
        const res = await bookings.getAll();
        state.bookings = res.data;
        walkinModal.classList.add('hidden');
        alert("Walk-in Booking Confirmed!");
        renderFn();
      } catch (err) {
        alert(err.response?.data?.error || "Error creating walk-in booking");
      }
    };
  }
}
