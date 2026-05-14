import { state, navigate } from '../state.js';
import { bookings, admin, cottages, addons, users } from '../api.js';


export function renderAdmin() {
  document.body.classList.remove('landing-page');
  const activeTab = state.adminTab || 'home';

  const navBtn = (tab, icon, label) => `
    <button data-tab="${tab}" class="admin-tab-btn w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-black shadow-xl shadow-white/10' : 'text-white/40 hover:bg-white/10'}">
      ${icon} ${label}
    </button>`;

  const homeIcon  = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>`;
  const usersIcon = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`;
  const prodIcon  = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>`;
  const sysIcon   = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>`;

  return `
    <!-- Mobile Header -->
    <div class="md:hidden fixed top-0 left-0 right-0 z-[250] flex items-center justify-between px-6 py-4 bg-black border-b border-white/10 shadow-sm text-white">
      <h1 class="text-xl font-black text-white tracking-tighter uppercase italic">NEXUS<span class="text-white/40">7101</span></h1>
      <button id="mobileMenuBtn" class="p-2 rounded-xl hover:bg-white/10 transition-colors">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>
    </div>

    <!-- Mobile Overlay Backdrop -->
    <div id="mobileMenuOverlay" class="md:hidden fixed inset-0 bg-black/50 z-[300] hidden backdrop-blur-sm"></div>

    <div class="min-h-screen bg-slate-50 flex pt-14 md:pt-0">
      <!-- Sidebar -->
      <aside id="adminSidebar" class="fixed md:relative top-0 left-0 h-full z-[350] w-72 md:w-80 bg-black border-r border-white/10 flex flex-col p-10 transition-transform duration-300 transform -translate-x-full md:translate-x-0 text-white">
        <div class="flex items-center gap-4 mb-12">
          <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 overflow-hidden">
             <img src="/logo.png" class="w-full h-full object-cover p-1.5">
          </div>
          <div>
            <h1 class="text-xl font-black text-white tracking-tighter uppercase italic leading-none">NEXUS<span class="text-white/40">7101</span></h1>
            <p class="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] mt-1">Admin Panel</p>
          </div>
        </div>

        <nav class="flex-1 space-y-1">
          ${navBtn('home',  homeIcon,  'Overview')}
          ${navBtn('users', usersIcon, 'Accounts')}
          ${navBtn('products', prodIcon, 'Resources')}
          ${navBtn('system', sysIcon, 'Activity')}
          ${navBtn('settings', `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`, 'Settings')}
        </nav>

        <div class="mt-auto pt-8 border-t border-white/10">
          <button id="logoutBtn" class="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-emerald-500 hover:bg-white/5 transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Sign Out
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6 md:p-12 overflow-y-auto">
        ${renderActiveTab(activeTab)}
      </main>
    </div>

    <!-- QR Verification Modal for Cash Payments -->
    <div id="qrVerifyModal" class="fixed inset-0 bg-black/60 backdrop-blur-xl z-[550] hidden flex items-center justify-center p-6">
      <div class="bg-white max-w-md w-full p-10 rounded-[3rem] shadow-3xl animate-scale-up border-2 border-white text-center">
         <div class="mb-6">
            <h3 class="text-2xl font-black text-black tracking-tighter italic">Verify QR Pass</h3>
            <p class="text-[10px] font-black text-black/40 uppercase tracking-widest mt-2">Scan customer's QR to confirm payment</p>
         </div>
         
         <div class="relative bg-slate-100 rounded-3xl overflow-hidden aspect-square mb-8">
            <video id="qrVerifyVideo" class="w-full h-full object-cover"></video>
            <canvas id="qrVerifyCanvas" class="hidden"></canvas>
            <div class="absolute inset-0 border-[30px] border-black/20"></div>
            <div class="absolute inset-[15%] border-2 border-white/50 rounded-2xl animate-pulse"></div>
         </div>
         
         <div class="space-y-4">
            <p id="qrVerifyStatus" class="text-[10px] font-black text-black/40 uppercase tracking-widest">Target ID: <span id="targetBookingId" class="text-black font-black"></span></p>
            
            <div class="relative pt-2">
               <input type="text" id="manualIdInput" class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-center uppercase tracking-widest focus:border-black outline-none" placeholder="Or Enter ID Manually">
               <button id="verifyIdManually" class="w-full mt-2 bg-black text-white font-black py-4 rounded-xl uppercase text-[10px] tracking-widest hover:bg-black transition-all">Verify & Confirm Payment</button>
            </div>

            <button id="closeQrVerify" class="w-full bg-slate-100 text-black/40 font-black py-4 rounded-xl uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all mt-4">Cancel</button>
         </div>
      </div>
    </div>
  `;
}

function renderActiveTab(tab) {
  switch (tab) {
    case 'users': return renderUsersView();
    case 'products': return renderProductsView();
    case 'system': return renderSystemView();
    case 'settings': return renderSettingsView();
    default: return renderHomeView();
  }
}

function renderSettingsView() {
  return `
    <div class="max-w-2xl mx-auto space-y-12 animate-fade-in">
      <header>
        <h2 class="text-6xl font-black text-black tracking-tighter italic">Settings.</h2>
        <p class="text-[10px] font-black text-black/40 uppercase tracking-[0.5em] mt-2">Manage your account</p>
      </header>

      <div class="bg-white p-10 md:p-14 rounded-[3rem] border border-black/5 shadow-2xl shadow-black/5">
        <form id="settingsForm" class="space-y-8">
           <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div class="space-y-2">
                <label class="text-[10px] font-black text-black/40 uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" name="name" value="${state.user.name}" class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-black focus:border-black outline-none transition-all" required>
             </div>
             <div class="space-y-2">
                <label class="text-[10px] font-black text-black/40 uppercase tracking-widest ml-1">Phone Number</label>
                <input type="text" name="phone" value="${state.user.phone || ''}" class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-black focus:border-black outline-none transition-all" placeholder="09123456789">
             </div>
           </div>

           <div class="space-y-2">
              <label class="text-[10px] font-black text-black/40 uppercase tracking-widest ml-1">Email Address (Gmail)</label>
              <input type="email" name="email" value="${state.user.email}" class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-black focus:border-black outline-none transition-all" required>
           </div>
           
           <div class="space-y-2">
              <label class="text-[10px] font-black text-black/40 uppercase tracking-widest ml-1">New Password (Leave blank to keep current)</label>
              <input type="password" name="password" placeholder="••••••••" class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-black focus:border-black outline-none transition-all">
           </div>

           <button type="submit" class="w-full py-5 bg-black text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-black/10 active:scale-95">Update Profile</button>
        </form>
      </div>
    </div>
  `;
}

function renderHomeView() {
  return `
    <div class="max-w-6xl mx-auto space-y-20 animate-fade-in">
      <header>
        <h2 class="text-6xl font-black text-black tracking-tighter">Overview.</h2>
        <p class="text-[10px] font-black text-black/40 uppercase tracking-[0.5em] mt-2">Activity Summary</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl group">
          <div class="w-10 h-10 bg-slate-50 text-black/40 rounded-xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <p class="text-[9px] font-black text-black/40 uppercase tracking-widest mb-1">Total Revenue</p>
          <h3 class="text-3xl font-black text-black tracking-tighter">₱${(state.bookings.filter(b => b.status === 'Confirmed').reduce((sum, b) => sum + b.total, 0)).toLocaleString()}</h3>
        </div>

        <div class="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl group">
          <div class="w-10 h-10 bg-slate-50 text-black/40 rounded-xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-all">
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          </div>
          <p class="text-[9px] font-black text-black/40 uppercase tracking-widest mb-1">Bookings</p>
          <h3 class="text-3xl font-black text-black tracking-tighter">${state.bookings.length}</h3>
        </div>

        <div class="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl group">
          <div class="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all">
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          <p class="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Approvals</p>
          <h3 class="text-3xl font-black text-emerald-500 tracking-tighter italic">${state.users.filter(u => u.status === 'pending').length}</h3>
        </div>

        <div class="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl group cursor-pointer" id="openWalkinModal">
          <div class="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
          </div>
          <p class="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Quick Action</p>
          <h3 class="text-3xl font-black text-emerald-500 tracking-tighter italic">New Booking</h3>
        </div>
      </div>

      <!-- Walk-in Modal -->
      <div id="walkinModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[500] hidden flex items-center justify-center p-4 md:p-6">
        <div class="bg-white w-full max-w-2xl rounded-[3rem] p-10 md:p-14 shadow-3xl animate-scale-up max-h-[90vh] overflow-y-auto border-2 border-white">
          <h3 class="text-4xl font-black text-black mb-10 tracking-tighter italic">Walk-in Booking.</h3>
          <form id="walkinForm" class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] ml-1">Customer Name</label>
                <input type="text" id="walkinName" class="input-field py-5 text-sm" placeholder="e.g. John Doe" required>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] ml-1">Booking Date</label>
                <input type="date" id="walkinDate" class="input-field py-5 text-sm" required value="${new Date().toISOString().split('T')[0]}">
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] ml-1">Cottage Selection</label>
                <select id="walkinCottage" class="input-field py-5 text-sm" required>
                  <option value="">Select a Cottage</option>
                  ${state.cottages.filter(c => c.active).map(c => `
                    <option value="${c.id}" data-price="${c.price}">#${c.id} - ${c.category} (₱${c.price})</option>
                  `).join('')}
                </select>
              </div>
            </div>
            
            <div class="space-y-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] ml-1">Add-ons</label>
                <div class="grid grid-cols-1 gap-3">
                  ${state.addons.map(a => `
                    <label class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all">
                      <div class="flex items-center gap-3">
                        <input type="checkbox" name="walkinAddon" value="${a.name}" data-price="${a.price}" class="w-5 h-5 rounded-lg border-slate-200 text-black focus:ring-black">
                        <span class="text-xs font-bold text-slate-700">${a.name}</span>
                      </div>
                      <span class="text-[10px] font-black text-black/40">₱${a.price}</span>
                    </label>
                  `).join('')}
                </div>
              </div>
              
              <div class="bg-black p-8 rounded-[2rem] text-white space-y-4 shadow-xl">
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
                    <span id="walkinGrandTotal" class="text-2xl font-black tracking-tighter text-emerald-500">₱0</span>
                 </div>
              </div>
            </div>

            <div class="md:col-span-2 flex gap-4 pt-6">
              <button type="button" id="closeWalkinModal" class="flex-1 py-5 bg-slate-50 text-black/40 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
              <button type="submit" class="flex-1 py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-95 transition-all">Confirm Walk-in</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Quick Payment Verification -->
      <section class="bg-black p-10 md:p-14 rounded-[3rem] text-white space-y-8 shadow-2xl shadow-black/30 animate-scale-up">
        <div class="flex items-center gap-6">
          <div class="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          <div>
            <h3 class="text-3xl font-black tracking-tighter">Quick Verify.</h3>
            <p class="text-[10px] font-black uppercase tracking-widest opacity-40 mt-1">Confirm Cash Payments via Transaction ID</p>
          </div>
        </div>
        
        <div class="flex flex-col md:flex-row gap-4">
          <input type="text" id="quickVerifyInput" class="flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-lg font-black uppercase tracking-widest outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all placeholder:text-white/10" placeholder="ENTER TRX-XXXXX">
          <button id="quickVerifyBtn" class="bg-emerald-500 text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">Confirm Payment</button>
        </div>
        
        <p class="text-[9px] font-bold text-white/20 italic uppercase tracking-widest">Type the ID provided by the customer at the City Hall window</p>
      </section>

      <!-- Recent Walk-ins List -->
      <!-- Recent Walk-ins -->
      <section class="space-y-8">
        <header>
          <h3 class="text-3xl font-black text-black tracking-tighter">Recent Walk-ins.</h3>
          <p class="text-[10px] font-black text-black/40 uppercase tracking-widest mt-1">On-site registration history</p>
        </header>

        <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-slate-50/50 border-b border-slate-50">
                <th class="px-10 py-5 text-[9px] font-black text-black/40 uppercase tracking-widest">ID</th>
                <th class="px-10 py-5 text-[9px] font-black text-black/40 uppercase tracking-widest">Customer</th>
                <th class="px-10 py-5 text-[9px] font-black text-black/40 uppercase tracking-widest">Cottage</th>
                <th class="px-10 py-5 text-[9px] font-black text-black/40 uppercase tracking-widest text-right">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              ${(() => {
                const walkins = (state.bookings || []).filter(b => b.walkin_name).slice(0, 5);
                if (walkins.length === 0) return `<tr><td colspan="4" class="p-16 text-center text-slate-300 font-black uppercase tracking-widest text-[10px] italic">No recent walk-ins</td></tr>`;
                return walkins.map(b => {
                  const cottage = state.cottages?.find(c => c.id == b.cottageId);
                  return `
                    <tr class="hover:bg-slate-50/30 transition-colors">
                      <td class="px-10 py-5 font-black text-black text-[10px] tracking-widest">${b.id}</td>
                      <td class="px-10 py-5">
                        <p class="font-black text-black text-sm">${b.walkin_name}</p>
                        <p class="text-[9px] font-bold text-black/40 uppercase tracking-widest mt-0.5">${b.date}</p>
                      </td>
                      <td class="px-10 py-5 text-xs font-bold text-slate-500">${cottage ? cottage.category : 'Cottage #' + b.cottageId}</td>
                      <td class="px-10 py-5 font-black text-black text-right text-xs">₱${(b.total || 0).toLocaleString()}</td>
                    </tr>
                  `;
                }).join('');
              })()}
            </tbody>
          </table>
        </div>
      </section>


      <!-- Recent Walk-ins List -->

      <!-- Premium Confirmation Modal -->
      <div id="adminConfirmModal" class="fixed inset-0 bg-black/60 backdrop-blur-xl z-[2000] hidden flex items-center justify-center p-6">
        <div class="bg-white max-w-sm w-full p-10 rounded-[3rem] shadow-3xl animate-scale-up border-2 border-white text-center space-y-8">
           <div class="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
           </div>
           <div class="space-y-3">
              <h4 class="text-2xl font-black text-black tracking-tighter italic">Are you sure?</h4>
              <p id="adminConfirmMessage" class="text-xs font-bold text-slate-500 leading-relaxed px-4">Do you really want to proceed with this action?</p>
           </div>
           <div class="flex flex-col gap-3">
              <button id="executeAdminConfirm" class="w-full bg-black text-white font-black py-5 rounded-2xl hover:bg-black transition-all active:scale-95 shadow-xl shadow-black/20 uppercase text-[10px] tracking-widest">Yes, Proceed</button>
              <button id="cancelAdminConfirm" class="w-full text-[10px] font-black text-black/40 uppercase tracking-widest hover:text-black transition-colors">Cancel</button>
           </div>
        </div>
      </div>

      <!-- Premium Toast Container -->
      <div id="adminToastContainer" class="fixed bottom-10 right-10 z-[1000] flex flex-col gap-4 pointer-events-none"></div>
    </div>
  `;
}

// Global Confirmation Helper
let currentConfirmCallback = null;
function showAdminConfirm(message, onConfirm) {
  const modal = document.getElementById('adminConfirmModal');
  const msgEl = document.getElementById('adminConfirmMessage');
  if (!modal || !msgEl) return;
  msgEl.innerText = message;
  currentConfirmCallback = onConfirm;
  modal.classList.remove('hidden');
}

// Global Notification Helper
function showAdminToast(message, type = 'info') {
  const container = document.getElementById('adminToastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border-2 backdrop-blur-xl animate-slide-in-right transition-all duration-500`;
  
  const colors = {
    success: 'bg-emerald-500/90 border-emerald-400 text-white',
    error: 'bg-emerald-500/90 border-rose-400 text-white',
    info: 'bg-black/90 border-slate-700 text-white'
  };
  
  const icons = {
    success: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>',
    error: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path></svg>',
    info: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
  };

  toast.classList.add(...(colors[type] || colors.info).split(' '));
  toast.innerHTML = `
    <div class="flex-shrink-0">${icons[type] || icons.info}</div>
    <p class="text-xs font-black uppercase tracking-widest leading-none">${message}</p>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-10');
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

function renderUsersView() {
  const activeSubTab = state.adminUserTab || 'customers';
  const sortedUsers = [...state.users].sort((a, b) => b.id - a.id);
  
  const customers = sortedUsers.filter(u => u.role === 'customer' && u.status === 'approved');
  const staff = sortedUsers.filter(u => u.role === 'inspector');
  const pending = sortedUsers.filter(u => u.role === 'customer' && u.status === 'pending');
  const rejected = sortedUsers.filter(u => u.role === 'customer' && u.status === 'rejected');
  
  const searchTerm = (state.userSearchTerm || '').toLowerCase();
  let displayUsers = [];
  if (activeSubTab === 'customers') displayUsers = customers;
  else if (activeSubTab === 'staff') displayUsers = staff;
  else if (activeSubTab === 'pending') displayUsers = pending;
  else if (activeSubTab === 'rejected') displayUsers = rejected;

  displayUsers = displayUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm) || 
    u.email.toLowerCase().includes(searchTerm)
  );

  return `
    <div class="space-y-10 animate-fade-in">
      <header class="flex justify-between items-end">
        <div>
          <h2 class="text-5xl font-black text-black tracking-tighter italic">Manage Users.</h2>
          <p class="text-xs font-black text-black/40 uppercase tracking-[0.4em] mt-2">Database of all platform members</p>
        </div>
        ${activeSubTab === 'staff' ? `
          <button id="openAddStaff" class="bg-black text-white font-black px-8 py-5 rounded-3xl text-xs uppercase tracking-widest shadow-xl shadow-black/20 hover:scale-105 transition-all">+ Add New Staff</button>
        ` : ''}
      </header>

      <div class="flex flex-wrap gap-4 p-2 bg-white rounded-3xl w-fit shadow-sm border border-slate-100">
        <button data-subtab="customers" class="admin-subtab-btn px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'customers' ? 'bg-black text-white shadow-lg' : 'text-black/40 hover:bg-slate-50'}">Customers (${customers.length})</button>
        <button data-subtab="pending" class="admin-subtab-btn px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'pending' ? 'bg-amber-500 text-white shadow-lg' : 'text-black/40 hover:bg-slate-50'}">Pending (${pending.length})</button>
        <button data-subtab="rejected" class="admin-subtab-btn px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'rejected' ? 'bg-emerald-500 text-white shadow-lg' : 'text-black/40 hover:bg-slate-50'}">Rejected (${rejected.length})</button>
        <button data-subtab="staff" class="admin-subtab-btn px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'staff' ? 'bg-black text-white shadow-lg' : 'text-black/40 hover:bg-slate-50'}">Staff (${staff.length})</button>
      </div>

      <div class="bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-slate-50 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-slate-50/50 border-b border-slate-100">
                <th class="px-6 md:px-10 py-6 md:py-8 text-[9px] font-black text-black/40 uppercase tracking-[0.2em]">Member Info</th>
                <th class="px-6 md:px-10 py-6 md:py-8 text-[9px] font-black text-black/40 uppercase tracking-[0.2em]">Account Status</th>
                <th class="px-6 md:px-10 py-6 md:py-8 text-[9px] font-black text-black/40 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              ${displayUsers.length === 0 ? `
                <tr>
                  <td colspan="3" class="px-6 md:px-10 py-12 md:py-20 text-center text-slate-300 font-black uppercase tracking-widest text-xs italic">No members found</td>
                </tr>
              ` : displayUsers.map(u => `
                <tr class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-6 md:px-10 py-4 md:py-6">
                    <div class="flex items-center gap-3 md:gap-4">
                      <div class="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-50 flex items-center justify-center text-black/40 border border-slate-100">
                         <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      </div>
                      <div>
                        <p class="font-black text-black text-sm">${u.name}</p>
                        <p class="text-[10px] font-bold text-black/40">${u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 md:px-10 py-4 md:py-6">
                    <span class="px-3 md:px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${u.status === 'pending' ? 'bg-amber-100 text-amber-600' : (u.status === 'rejected' ? 'bg-rose-100 text-emerald-600' : 'bg-emerald-100 text-emerald-600')}">
                      ${u.status}
                    </span>
                  </td>
                  <td class="px-6 md:px-10 py-4 md:py-6 text-right">
                    ${activeSubTab === 'pending' || activeSubTab === 'rejected' ? `
                      <button class="review-user-btn text-[10px] font-black text-black border-2 border-slate-100 px-4 md:px-6 py-2 rounded-xl hover:bg-black hover:text-white transition-all" data-id="${u.id}">Review</button>
                    ` : `
                      <div class="flex flex-col items-end">
                        <p class="text-[10px] font-black text-black uppercase tracking-widest">${u.phone || 'NO PHONE'}</p>
                      </div>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <div id="addStaffModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] hidden flex items-center justify-center p-4 md:p-6">
      <div class="bg-white w-full max-w-lg rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-3xl animate-scale-up">
        <h3 class="text-3xl font-black text-black mb-8 tracking-tighter italic">New Staff Member.</h3>
        <form id="addStaffForm" class="space-y-4">
          <input type="text" id="staffName" class="input-field" placeholder="Full Name" required>
          <input type="email" id="staffEmail" class="input-field" placeholder="Gmail Address" required>
          <input type="tel" id="staffPhone" class="input-field" placeholder="Phone Number" required>
          <input type="password" id="staffPass" class="input-field" placeholder="Assign Password" required>
          <div class="flex gap-4 pt-4">
            <button type="button" id="closeStaffModal" class="flex-1 py-4 bg-slate-50 text-black/40 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
            <button type="submit" class="flex-1 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Create Staff</button>
          </div>
        </form>
      </div>
    </div>

    <div id="reviewUserModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] hidden flex items-center justify-center p-4 md:p-6">
      <div class="bg-white w-full max-w-2xl rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-3xl animate-scale-up max-h-[90vh] overflow-y-auto">
        <div id="reviewContent"></div>
      </div>
    </div>

    <!-- ID Zoom Modal -->
    <div id="imageZoomModal" class="fixed inset-0 bg-black/95 z-[300] hidden flex flex-col items-center justify-center p-10 backdrop-blur-xl">
       <button id="closeZoom" class="absolute top-10 right-10 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
       </button>
       <div class="w-full h-full flex items-center justify-center">
          <img id="zoomedImage" class="max-w-full max-h-full object-contain rounded-2xl shadow-2xl">
       </div>
       <p class="mt-8 text-white/40 font-black uppercase tracking-[0.5em] text-[10px]">Original Resolution ID View</p>
    </div>
  `;
}

function renderProductsView() {
  return `
    <div class="max-w-6xl mx-auto space-y-20 animate-fade-in">
      <header class="flex justify-between items-center">
        <div>
          <h2 class="text-5xl font-black text-black tracking-tighter">Resources.</h2>
          <p class="text-[10px] font-black text-black/40 uppercase tracking-[0.5em] mt-2">Inventory and Add-on Management</p>
        </div>
        <button id="openAddCottage" class="bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-black/10">New Cottage</button>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${state.cottages.map(c => `
          <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative">
            <div class="flex justify-between items-start mb-6">
              <div class="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-black font-black text-xs group-hover:bg-black group-hover:text-white transition-all">#${c.id}</div>
              <span class="px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${c.active ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-50 text-emerald-500'}">${c.active ? 'Available' : 'Maintenance'}</span>
            </div>
            <h4 class="text-xl font-black text-black mb-1">${c.category}</h4>
            <p class="text-sm font-bold text-black/40 mb-6">₱${c.price.toLocaleString()}</p>
            <div class="pt-6 border-t border-slate-50 flex justify-between items-center">
               <button class="delete-cottage-btn text-[9px] font-black uppercase tracking-widest text-rose-300 hover:text-emerald-500 transition-colors" data-id="${c.id}">Remove</button>
               <button class="toggle-cottage-btn text-[9px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors" data-id="${c.id}">${c.active ? 'Disable' : 'Enable'}</button>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="pt-10 space-y-10">
        <header class="flex justify-between items-center">
          <div>
            <h3 class="text-3xl font-black text-black tracking-tighter">Add-ons.</h3>
            <p class="text-[10px] font-black text-black/40 uppercase tracking-widest mt-1">Extra services and products</p>
          </div>
          <button id="openAddAddon" class="bg-black text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">New Add-on</button>
        </header>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          ${state.addons.map(a => `
            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group">
              <p class="font-black text-black text-sm mb-1">${a.name}</p>
              <p class="text-[10px] font-bold text-black/40 uppercase tracking-widest">₱${a.price.toLocaleString()}</p>
              <button class="delete-addon-btn absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-rose-400 hover:text-emerald-600" data-id="${a.id}">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Modals -->
    <div id="addCottageModal" class="fixed inset-0 bg-black/40 backdrop-blur-md z-[110] hidden flex items-center justify-center p-6">
      <div class="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl">
        <h3 class="text-3xl font-black text-black mb-8 tracking-tighter">New Asset.</h3>
        <form id="addCottageForm" class="space-y-4">
          <input type="text" id="cottageCategory" class="input-field" placeholder="Category Name" required>
          <input type="number" id="cottagePrice" class="input-field" placeholder="Price (₱)" required>
          <div class="flex gap-4 pt-4">
            <button type="button" id="closeCottageModal" class="flex-1 py-4 bg-slate-50 text-black/40 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
            <button type="submit" class="flex-1 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Create</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderSystemView() {
  const bks = state.bookings || [];
  const confirmed = bks.filter(b => b.status === 'Confirmed');
  const totalRevenue = confirmed.reduce((s, b) => s + (b.total || 0), 0);

  return `
    <div class="space-y-12 animate-fade-in">
      <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 class="text-5xl font-black text-black tracking-tighter">Analytics.</h2>
          <p class="text-[10px] font-black text-black/40 uppercase tracking-[0.5em] mt-2">Data Insights & Activity</p>
        </div>
        <div class="flex gap-4 w-full md:w-auto">
           <div class="relative flex-1 md:w-64">
              <input type="text" id="logSearch" class="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold focus:border-black transition-all outline-none shadow-sm" placeholder="Search logs...">
           </div>
           <button id="refreshData" class="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 transition-all">
              <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
           </button>
        </div>
      </header>

      <!-- KPI Summary -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-black p-8 rounded-[2rem] text-white">
          <p class="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">Total Revenue</p>
          <h3 class="text-2xl font-black tracking-tighter italic text-emerald-400">₱${totalRevenue.toLocaleString()}</h3>
        </div>
        <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <p class="text-[9px] font-black uppercase tracking-widest text-black/40 mb-2">Bookings</p>
          <h3 class="text-2xl font-black text-black tracking-tighter">${bks.length}</h3>
        </div>
        <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <p class="text-[9px] font-black uppercase tracking-widest text-black/40 mb-2">Confirmed</p>
          <h3 class="text-2xl font-black text-emerald-500 tracking-tighter">${confirmed.length}</h3>
        </div>
        <div class="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <p class="text-[9px] font-black uppercase tracking-widest text-black/40 mb-2">Success Rate</p>
          <h3 class="text-2xl font-black text-black tracking-tighter">${bks.length ? Math.round((confirmed.length/bks.length)*100) : 0}%</h3>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p class="text-[10px] font-black text-black/40 uppercase tracking-widest mb-6">Booking Velocity</p>
          <div class="h-64"><canvas id="chartMonthly"></canvas></div>
        </div>
        <div class="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p class="text-[10px] font-black text-black/40 uppercase tracking-widest mb-6">Status Mix</p>
          <div class="h-64"><canvas id="chartStatus"></canvas></div>
        </div>
        <div class="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p class="text-[10px] font-black text-black/40 uppercase tracking-widest mb-6">Cottage Demand</p>
          <div class="h-64"><canvas id="chartCottages"></canvas></div>
        </div>
        <div class="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p class="text-[10px] font-black text-black/40 uppercase tracking-widest mb-6">Revenue Trend (₱)</p>
          <div class="h-64"><canvas id="chartRevenue"></canvas></div>
        </div>
      </div>

      <div class="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <p class="text-[10px] font-black text-black/40 uppercase tracking-widest mb-6">Add-on Popularity</p>
        <div class="h-48"><canvas id="chartAddons"></canvas></div>
      </div>

      <!-- Transaction Log -->
      <div class="space-y-6">
        <h3 class="text-2xl font-black text-black tracking-tighter">Transaction Log.</h3>
        <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-slate-50/50 border-b border-slate-50">
                <th class="px-10 py-5 text-[9px] font-black text-black/40 uppercase tracking-widest">Booking ID</th>
                <th class="px-10 py-5 text-[9px] font-black text-black/40 uppercase tracking-widest">Cottage</th>
                <th class="px-10 py-5 text-[9px] font-black text-black/40 uppercase tracking-widest">Date</th>
                <th class="px-10 py-5 text-[9px] font-black text-black/40 uppercase tracking-widest">Processed By</th>
                <th class="px-10 py-5 text-[9px] font-black text-black/40 uppercase tracking-widest">Status</th>
                <th class="px-10 py-5 text-[9px] font-black text-black/40 uppercase tracking-widest">Total</th>
                <th class="px-10 py-5 text-[9px] font-black text-black/40 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              ${(() => {
                const search = (state.logSearchTerm || '').toLowerCase();
                return (state.bookings || [])
                  .filter(b => b.id.toLowerCase().includes(search) || (b.walkin_name || b.userName || '').toLowerCase().includes(search))
                  .map(b => {
                    const cottage = state.cottages?.find(c => c.id == b.cottageId);
                    const statusColor = b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600'
                      : b.status === 'Cancelled' ? 'bg-emerald-50 text-emerald-500'
                      : 'bg-amber-50 text-amber-600';
                    const displayName = b.walkin_name ? `WALK-IN: ${b.walkin_name}` : (b.userName || `User ID: ${b.userId}`);
                    
                    return `
                    <tr class="hover:bg-slate-50/30 transition-colors">
                      <td class="px-10 py-5 font-black text-black text-[10px] tracking-widest">${b.id}</td>
                      <td class="px-10 py-5 text-xs font-bold text-slate-600">${cottage ? cottage.category : 'Cottage #' + b.cottageId}</td>
                      <td class="px-10 py-5 text-xs font-bold text-black/40">${b.date || '—'}</td>
                      <td class="px-10 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">${displayName}</td>
                      <td class="px-10 py-5"><span class="px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${statusColor}">${b.status}</span></td>
                      <td class="px-10 py-5 font-black text-black text-xs">₱${(b.total || 0).toLocaleString()}</td>
                      <td class="px-10 py-5 text-right">
                        ${b.status === 'Pending' ? `
                          <button class="verify-payment-btn text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-800" data-id="${b.id}">Confirm Cash</button>
                        ` : '<span class="text-[9px] font-black text-slate-200 uppercase tracking-widest italic">Archived</span>'}
                      </td>
                    </tr>`;
                  }).join('');
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function loadChartJs(cb) {
  if (window.Chart) { cb(); return; }
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js';
  s.onload = cb;
  document.head.appendChild(s);
}

export function attachSystemCharts() {
  loadChartJs(() => {
    const bks = state.bookings || [];

    // ── 1. MONTHLY BOOKINGS ───────────────────────────────────────────
    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthlyCount   = Array(12).fill(0);
    const monthlyRevenue = Array(12).fill(0);
    bks.forEach(b => {
      if (!b.date) return;
      const m = parseInt(b.date.split('-')[1]) - 1;
      if (m >= 0 && m < 12) {
        monthlyCount[m]++;
        if (b.status === 'Confirmed') monthlyRevenue[m] += (b.total || 0);
      }
    });

    const ctxM = document.getElementById('chartMonthly');
    if (ctxM) {
      if (ctxM._chartInstance) ctxM._chartInstance.destroy();
      ctxM._chartInstance = new Chart(ctxM, {
        type: 'bar',
        data: {
          labels: MONTHS,
          datasets: [{
            label: 'Bookings',
            data: monthlyCount,
            backgroundColor: monthlyCount.map((_, i) =>
              `hsla(${220 - i * 5}, 70%, ${55 + i * 1}%, 0.85)`
            ),
            borderRadius: 10,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { weight: '900', size: 10 }, color: '#94a3b8' } },
            y: { grid: { color: '#f1f5f9' }, ticks: { font: { weight: '700', size: 10 }, color: '#94a3b8', stepSize: 1 }, beginAtZero: true }
          }
        }
      });
    }

    // ── 2. STATUS DOUGHNUT ────────────────────────────────────────────
    const confirmed = bks.filter(b => b.status === 'Confirmed').length;
    const pending   = bks.filter(b => b.status === 'Pending').length;
    const cancelled = bks.filter(b => b.status === 'Cancelled').length;
    const ctxS = document.getElementById('chartStatus');
    if (ctxS) {
      if (ctxS._chartInstance) ctxS._chartInstance.destroy();
      ctxS._chartInstance = new Chart(ctxS, {
        type: 'doughnut',
        data: {
          labels: ['Confirmed', 'Pending', 'Cancelled'],
          datasets: [{ data: [confirmed, pending, cancelled],
            backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
            borderWidth: 0, hoverOffset: 8 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '70%',
          plugins: { legend: { position: 'bottom', labels: { font: { weight: '900', size: 10 }, color: '#475569', padding: 16, usePointStyle: true } } }
        }
      });
    }

    // ── 3. MOST BOOKED COTTAGE TYPES ─────────────────────────────────
    const categoryMap = {};
    bks.forEach(b => {
      const c = state.cottages?.find(ct => ct.id == b.cottageId);
      const cat = c ? c.category : 'Unknown';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    const catLabels = Object.keys(categoryMap);
    const catData   = Object.values(categoryMap);
    const ctxC = document.getElementById('chartCottages');
    if (ctxC) {
      if (ctxC._chartInstance) ctxC._chartInstance.destroy();
      ctxC._chartInstance = new Chart(ctxC, {
        type: 'bar',
        data: {
          labels: catLabels,
          datasets: [{ label: 'Bookings', data: catData,
            backgroundColor: ['#0f172a','#334155','#64748b'],
            borderRadius: 12, borderSkipped: false }]
        },
        options: {
          indexAxis: 'y',
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: '#f1f5f9' }, ticks: { font: { weight: '700', size: 10 }, color: '#94a3b8', stepSize: 1 }, beginAtZero: true },
            y: { grid: { display: false }, ticks: { font: { weight: '900', size: 11 }, color: '#334155' } }
          }
        }
      });
    }

    // ── 4. REVENUE BY MONTH ───────────────────────────────────────────
    const ctxR = document.getElementById('chartRevenue');
    if (ctxR) {
      if (ctxR._chartInstance) ctxR._chartInstance.destroy();
      const gradient = ctxR.getContext('2d').createLinearGradient(0, 0, 0, 180);
      gradient.addColorStop(0, 'rgba(16,185,129,0.3)');
      gradient.addColorStop(1, 'rgba(16,185,129,0)');
      ctxR._chartInstance = new Chart(ctxR, {
        type: 'line',
        data: {
          labels: MONTHS,
          datasets: [{ label: 'Revenue (₱)', data: monthlyRevenue,
            borderColor: '#10b981', backgroundColor: gradient,
            borderWidth: 3, pointRadius: 5, pointBackgroundColor: '#10b981',
            tension: 0.4, fill: true }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { weight: '900', size: 10 }, color: '#94a3b8' } },
            y: { grid: { color: '#f1f5f9' }, ticks: { font: { weight: '700', size: 10 }, color: '#94a3b8', callback: v => '₱' + v.toLocaleString() }, beginAtZero: true }
          }
        }
      });
    }

    // ── 5. TOP ADD-ONS ────────────────────────────────────────────────
    const addonMap = {};
    bks.forEach(b => {
      const ads = Array.isArray(b.addons) ? b.addons : (b.addons ? b.addons.split(',') : []);
      ads.forEach(a => { a = a.trim(); if (a) addonMap[a] = (addonMap[a] || 0) + 1; });
    });

    // Sort add-ons by usage frequency (descending)
    const sortedAddons = Object.entries(addonMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const addonLabels = sortedAddons.map(a => a.name);
    const addonData   = sortedAddons.map(a => a.count);
    const ctxA = document.getElementById('chartAddons');
    if (ctxA) {
      if (ctxA._chartInstance) ctxA._chartInstance.destroy();
      ctxA._chartInstance = new Chart(ctxA, {
        type: 'bar',
        data: {
          labels: addonLabels.length ? addonLabels : ['No data'],
          datasets: [{ label: 'Times Used', data: addonData.length ? addonData : [0],
            backgroundColor: '#f59e0b', borderRadius: 10, borderSkipped: false }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { weight: '900', size: 11 }, color: '#334155' } },
            y: { grid: { color: '#f1f5f9' }, ticks: { font: { weight: '700', size: 10 }, color: '#94a3b8', stepSize: 1 }, beginAtZero: true }
          }
        }
      });
    }
  });
}

function renderPlaceholder(title) {
  return `<div class="p-20 text-center"><h2 class="text-2xl font-black text-slate-200 uppercase tracking-widest italic">${title} Coming Soon</h2></div>`;
}

export function attachAdminListeners(renderFn) {
  // Close Confirm Modal Logic
  const closeConfirm = () => {
    const modal = document.getElementById('adminConfirmModal');
    if (modal) modal.classList.add('hidden');
    currentConfirmCallback = null;
  };

  const cancelConfirmBtn = document.getElementById('cancelAdminConfirm');
  if (cancelConfirmBtn) cancelConfirmBtn.onclick = closeConfirm;

  const executeConfirmBtn = document.getElementById('executeAdminConfirm');
  if (executeConfirmBtn) executeConfirmBtn.onclick = () => {
    if (currentConfirmCallback) currentConfirmCallback();
    closeConfirm();
  };

  // Sidebar hamburger (mobile)
  const sidebar  = document.getElementById('adminSidebar');
  const overlay  = document.getElementById('mobileMenuOverlay');
  const openBtn  = document.getElementById('mobileMenuBtn');
  if (openBtn)  openBtn.onclick  = () => { sidebar?.classList.remove('-translate-x-full'); overlay?.classList.remove('hidden'); };
  if (overlay)  overlay.onclick  = () => { sidebar?.classList.add('-translate-x-full');    overlay?.classList.add('hidden'); };

  // Tab Switching
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.onclick = () => { 
      state.adminTab = btn.dataset.tab; 
      sidebar?.classList.add('-translate-x-full');
      overlay?.classList.add('hidden');
      renderFn(); 
      if (btn.dataset.tab === 'system') attachSystemCharts(); 
    };
  });

  // Subtab Switching (Accounts)
  document.querySelectorAll('.admin-subtab-btn').forEach(btn => {
    btn.onclick = () => { state.adminUserTab = btn.dataset.subtab; renderFn(); };
  });

  // Search Listeners
  const userSearch = document.getElementById('userSearch');
  if (userSearch) {
    userSearch.value = state.userSearchTerm || '';
    userSearch.oninput = (e) => { state.userSearchTerm = e.target.value; renderFn(); userSearch.focus(); };
  }

  const logSearch = document.getElementById('logSearch');
  if (logSearch) {
    logSearch.value = state.logSearchTerm || '';
    logSearch.oninput = (e) => { state.logSearchTerm = e.target.value; renderFn(); logSearch.focus(); };
  }

  // Draw charts if already on system tab
  if ((state.adminTab || 'home') === 'system') attachSystemCharts();

  document.querySelectorAll('.admin-subtab-btn').forEach(btn => {
    btn.onclick = () => { state.adminUserTab = btn.dataset.subtab; renderFn(); };
  });

  // Modal Control
  const openAddStaff = document.getElementById('openAddStaff');
  const addStaffModal = document.getElementById('addStaffModal');
  const closeStaffModal = document.getElementById('closeStaffModal');
  if (openAddStaff) openAddStaff.onclick = () => addStaffModal.classList.remove('hidden');
  if (closeStaffModal) closeStaffModal.onclick = () => addStaffModal.classList.add('hidden');

  // Add Staff Submit
  const addStaffForm = document.getElementById('addStaffForm');
  if (addStaffForm) {
    addStaffForm.onsubmit = async (e) => {
      e.preventDefault();
      const userData = {
        name: document.getElementById('staffName').value,
        email: document.getElementById('staffEmail').value,
        phone: document.getElementById('staffPhone').value,
        password: document.getElementById('staffPass').value,
        role: 'inspector',
        status: 'approved'
      };
      try {
        await admin.createStaff(userData);
        const res = await admin.getUsers();
        state.users = res.data;
        addStaffModal.classList.add('hidden');
        renderFn();
        showAdminToast("Staff Added Successfully!", "success");
      } catch (err) { showAdminToast(err.response?.data?.error || "Error adding staff", "error"); }
    };
  }

  // Review Modal Logic
  const reviewUserBtns = document.querySelectorAll('.review-user-btn');
  const reviewUserModal = document.getElementById('reviewUserModal');
  const reviewContent = document.getElementById('reviewContent');

  reviewUserBtns.forEach(btn => {
    btn.onclick = () => {
      const userId = parseInt(btn.dataset.id);
      const u = state.users.find(user => user.id === userId);
      if (!u) return;

      reviewContent.innerHTML = `
        <div class="space-y-8">
          <div class="flex justify-between items-center border-b border-slate-100 pb-6">
            <div>
              <h4 class="text-3xl font-black text-black tracking-tight italic">Identity Verification</h4>
              <p class="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Reviewing ID: ${u.id}</p>
            </div>
            <button id="closeReview" class="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <svg class="w-6 h-6 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4">
               <p class="text-[10px] font-black text-black/40 uppercase tracking-widest">Provided ID / Photo (Click to Full View)</p>
               <div class="aspect-square bg-slate-100 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl cursor-zoom-in group relative" id="zoomTrigger">
                  ${u.id_photo ? `
                    <img src="${u.id_photo}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                  ` : `
                    <div class="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
                       <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                  `}
                  <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                  </div>
               </div>
            </div>

            <div class="flex flex-col justify-center space-y-5">
              <div class="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p class="text-[10px] font-black text-black/40 uppercase tracking-widest mb-1">Full Name</p>
                <p class="text-lg font-bold text-black">${u.name}</p>
              </div>
              <div class="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p class="text-[10px] font-black text-black/40 uppercase tracking-widest mb-1">Contact Details</p>
                <p class="text-sm font-bold text-black">${u.email}</p>
                <p class="text-sm font-bold text-slate-600 mt-1">${u.phone || 'No Phone'}</p>
              </div>
              <div class="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p class="text-[10px] font-black text-black/40 uppercase tracking-widest mb-1">Personal Info</p>
                <p class="text-sm font-bold text-black"><span class="text-black/40 font-medium">B-Day:</span> ${u.birthday || 'N/A'}</p>
                <p class="text-sm font-bold text-black mt-1"><span class="text-black/40 font-medium">Address:</span> ${u.address || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div class="flex gap-4 pt-4">
            <button id="rejectUser" class="flex-1 py-5 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">Decline Account</button>
            <button id="approveUser" class="flex-1 py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20">Approve Access</button>
          </div>
        </div>
      `;
      reviewUserModal.classList.remove('hidden');

      // Zoom Logic
      const zoomTrigger = document.getElementById('zoomTrigger');
      const zoomModal = document.getElementById('imageZoomModal');
      const zoomedImg = document.getElementById('zoomedImage');
      const closeZoom = document.getElementById('closeZoom');

      if (zoomTrigger) {
        zoomTrigger.onclick = () => {
          zoomedImg.src = u.id_photo || `https://i.pravatar.cc/800?u=${u.email}`;
          zoomModal.classList.remove('hidden');
        };
      }
      if (closeZoom) closeZoom.onclick = () => zoomModal.classList.add('hidden');

      document.getElementById('closeReview').onclick = () => reviewUserModal.classList.add('hidden');
      document.getElementById('approveUser').onclick = () => {
        showAdminConfirm(`Approve account for ${u.name}?`, async () => {
          try {
            await admin.updateUserStatus(u.id, 'approved');
            const res = await admin.getUsers();
            state.users = res.data;
            reviewUserModal.classList.add('hidden');
            renderFn();
            showAdminToast("Account Approved", "success");
          } catch (err) { showAdminToast("Failed to approve", "error"); }
        });
      };
      document.getElementById('rejectUser').onclick = () => {
        showAdminConfirm("Reject this account?", async () => {
          try {
            await admin.updateUserStatus(u.id, 'rejected');
            const res = await admin.getUsers();
            state.users = res.data;
            reviewUserModal.classList.add('hidden');
            renderFn();
            showAdminToast("Account Rejected", "info");
          } catch (err) { showAdminToast("Failed to reject", "error"); }
        });
      };
    };
  });

  // Cottage Management Listeners
  const openAddCottage = document.getElementById('openAddCottage');
  const addCottageModal = document.getElementById('addCottageModal');
  const closeCottageModal = document.getElementById('closeCottageModal');
  if (openAddCottage) openAddCottage.onclick = () => addCottageModal.classList.remove('hidden');
  if (closeCottageModal) closeCottageModal.onclick = () => addCottageModal.classList.add('hidden');

  const addCottageForm = document.getElementById('addCottageForm');
  if (addCottageForm) {
    addCottageForm.onsubmit = async (e) => {
      e.preventDefault();
      const data = {
        category: document.getElementById('cottageCategory').value,
        price: parseInt(document.getElementById('cottagePrice').value),
        amenities: document.getElementById('cottageAmenities').value
      };
      try {
        await admin.createCottage(data);
        const res = await cottages.getAll();
        state.cottages = res.data;
        addCottageModal.classList.add('hidden');
        renderFn();
      } catch (err) { showAdminToast("Error adding cottage", "error"); }
    };
  }

  const updatePriceBtns = document.querySelectorAll('.update-price-btn');
  updatePriceBtns.forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      const currentPrice = btn.dataset.price;
      const newPrice = prompt(`Enter new price for Cottage #${id}:`, currentPrice);
      
      if (newPrice !== null && !isNaN(newPrice) && newPrice !== "") {
        try {
          await admin.updateCottage(id, { price: parseInt(newPrice) });
          const { cottages: cottageApi } = await import('../api.js');
          const res = await cottageApi.getAll();
          state.cottages = res.data;
          renderFn();
          showAdminToast("Price updated", "success");
        } catch (err) { showAdminToast("Error updating price", "error"); }
      }
    };
  });

  const toggleButtons = document.querySelectorAll('.toggle-maintenance-btn');
  toggleButtons.forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      const currentActive = btn.dataset.active === 'true' || btn.dataset.active === '1';
      try {
        await admin.updateCottage(id, { active: !currentActive });
        const { cottages: cottageApi } = await import('../api.js');
        const res = await cottageApi.getAll();
        state.cottages = res.data;
        renderFn();
      } catch (err) { showAdminToast("Error updating status", "error"); }
    };
  });

  // Add-on Management Listeners
  const openAddAddon = document.getElementById('openAddAddon');
  const addAddonModal = document.getElementById('addAddonModal');
  const closeAddonModal = document.getElementById('closeAddonModal');
  if (openAddAddon) openAddAddon.onclick = () => addAddonModal.classList.remove('hidden');
  if (closeAddonModal) closeAddonModal.onclick = () => addAddonModal.classList.add('hidden');

  const addAddonForm = document.getElementById('addAddonForm');
  if (addAddonForm) {
    addAddonForm.onsubmit = async (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById('addonName').value,
        price: parseInt(document.getElementById('addonPrice').value)
      };
      try {
        await admin.createAddon(data);
        const res = await addons.getAll();
        state.addons = res.data;
        addAddonModal.classList.add('hidden');
        renderFn();
      } catch (err) { showAdminToast("Error adding add-on", "error"); }
    };
  }

  const updateAddonPriceBtns = document.querySelectorAll('.update-addon-price-btn');
  updateAddonPriceBtns.forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      const name = btn.dataset.name;
      const currentPrice = btn.dataset.price;
      const newPrice = prompt(`Enter new price for ${name}:`, currentPrice);
      
      if (newPrice !== null && !isNaN(newPrice) && newPrice !== "") {
        try {
          await admin.updateAddon(id, { price: parseInt(newPrice) });
          const res = await addons.getAll();
          state.addons = res.data;
          renderFn();
          showAdminToast("Price updated", "success");
        } catch (err) { showAdminToast("Error updating price", "error"); }
      }
    };
  });

  const deleteAddonBtns = document.querySelectorAll('.delete-addon-btn');
  deleteAddonBtns.forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      showAdminConfirm("Remove this add-on from services?", async () => {
        try {
          await admin.deleteAddon(id);
          const res = await addons.getAll();
          state.addons = res.data;
          renderFn();
          showAdminToast("Add-on removed", "success");
        } catch (err) { showAdminToast("Error removing add-on", "error"); }
      });
    };
  });

  const deleteButtons = document.querySelectorAll('.delete-cottage-btn');
  deleteButtons.forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      showAdminConfirm("Are you sure you want to delete this cottage? This cannot be undone.", async () => {
        try {
          await admin.deleteCottage(id);
          const { cottages: cottageApi } = await import('../api.js');
          const res = await cottageApi.getAll();
          state.cottages = res.data;
          renderFn();
          showAdminToast("Cottage deleted", "success");
        } catch (err) { showAdminToast("Error deleting cottage", "error"); }
      });
    };
  });

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.onclick = () => {
    state.user = null;
    state.token = null;
    state.bookings = [];
    state.cottages = [];
    state.users = [];
    state.addons = [];
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('login', renderFn);
  };

  // Quick Payment Verification (Home Overview)
  const quickVerifyBtn = document.getElementById('quickVerifyBtn');
  const quickVerifyInput = document.getElementById('quickVerifyInput');
  
  if (quickVerifyBtn && quickVerifyInput) {
    const handleQuickVerify = async () => {
      const inputId = quickVerifyInput.value.trim().toUpperCase();
      if (!inputId) return;
      
      const fullId = inputId.startsWith('TRX-') ? inputId : `TRX-${inputId}`;
      const booking = (state.bookings || []).find(b => b.id === fullId);
      
      if (!booking) {
        showAdminToast(`Transaction ID ${fullId} not found.`, "error");
        return;
      }
      
      if (booking.status === 'Confirmed') {
        showAdminToast(`Transaction ${fullId} was already confirmed on ${booking.created_at || 'a previous date'}.`, "info");
        return;
      }

      if (booking.status === 'Cancelled' || booking.status === 'Expired') {
        showAdminToast(`Cannot confirm. This transaction is already ${booking.status}.`, "error");
        return;
      }
      
      showAdminConfirm(`Confirm cash payment of ₱${booking.total.toLocaleString()} for ${booking.userName || 'Customer'}?`, async () => {
        try {
          await bookings.verifyPayment(fullId);
          const res = await bookings.getAll();
          state.bookings = res.data;
          quickVerifyInput.value = '';
          renderFn();
          showAdminToast(`Success! Payment for ${fullId} confirmed.`, "success");
        } catch (err) {
          showAdminToast(err.response?.data?.error || "Error confirming payment", "error");
        }
      });
    };
    
    quickVerifyBtn.onclick = handleQuickVerify;
    quickVerifyInput.onkeyup = (e) => { if (e.key === 'Enter') handleQuickVerify(); };
  }

  // Refresh Button (Analytics Tab)
  const refreshBtn = document.getElementById('refreshData');
  if (refreshBtn) refreshBtn.onclick = () => renderFn();

  // Walk-in Listeners
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
    
    // Filter Cottages based on availability for the selected date (Hold Pending & Confirmed)
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
      const addons = [];
      document.querySelectorAll('input[name="walkinAddon"]:checked').forEach(cb => {
        addons.push(cb.value);
      });

      const cottageSelect = document.getElementById('walkinCottage');
      const basePrice = parseInt(cottageSelect.options[cottageSelect.selectedIndex].dataset.price);
      const addonTotal = addons.reduce((sum, name) => {
        const a = state.addons.find(ad => ad.name === name);
        return sum + (a ? a.price : 0);
      }, 0);

      const bookingData = {
        walkinName: document.getElementById('walkinName').value,
        date: document.getElementById('walkinDate').value,
        cottageId: parseInt(cottageSelect.value),
        addons: addons,
        total: basePrice + addonTotal,
        paymentMethod: 'Cash (Walk-in)',
        status: 'Confirmed'
      };

      try {
        await bookings.create(bookingData);
        const res = await bookings.getAll();
        state.bookings = res.data;
        walkinModal.classList.add('hidden');
        renderFn();
        showAdminToast("Walk-in Booking Confirmed!", "success");
      } catch (err) {
        showAdminToast(err.response?.data?.error || "Error creating walk-in booking", "error");
      }
    };
  }

  // Verify Payment Listener (NOW WITH QR SCAN)
  const qrModal = document.getElementById('qrVerifyModal');
  const targetIdSpan = document.getElementById('targetBookingId');
  let currentTargetId = null;
  let qrScannerActive = false;

  document.querySelectorAll('.verify-payment-btn').forEach(btn => {
    btn.onclick = () => {
      currentTargetId = btn.dataset.id;
      targetIdSpan.innerText = currentTargetId;
      qrModal.classList.remove('hidden');
      startQrVerification();
    };
  });

  const closeQrVerify = document.getElementById('closeQrVerify');
  if (closeQrVerify) closeQrVerify.onclick = () => {
    qrModal.classList.add('hidden');
    qrScannerActive = false;
    document.getElementById('manualIdInput').value = '';
    const video = document.getElementById('qrVerifyVideo');
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const verifyIdManually = document.getElementById('verifyIdManually');
  if (verifyIdManually) verifyIdManually.onclick = () => {
    const manualInput = document.getElementById('manualIdInput').value.trim().toUpperCase();
    if (!manualInput) {
      showAdminToast("Please enter the Transaction ID", "info");
      return;
    }
    
    // Ensure "TRX-" prefix is handled if customer provides just the code
    const fullScannedId = manualInput.startsWith('TRX-') ? manualInput : `TRX-${manualInput}`;
    handleVerifyResult(fullScannedId);
  };

  function loadScannerScript(cb) {
    if (window.jsQR) { cb(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  async function startQrVerification() {
    loadScannerScript(async () => {
      const video = document.getElementById('qrVerifyVideo');
      const canvas = document.getElementById('qrVerifyCanvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      qrScannerActive = true;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
        video.setAttribute("playsinline", true);
        video.play();
        requestAnimationFrame(tick);
      } catch (err) {
        showAdminToast("Scanner Error: " + err.message, "error");
        qrModal.classList.add('hidden');
      }

      function tick() {
        if (!qrScannerActive) return;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });

          if (code) {
            handleVerifyResult(code.data);
            return;
          }
        }
        requestAnimationFrame(tick);
      }
    });
  }

  async function handleVerifyResult(scannedId) {
    qrScannerActive = false;
    const video = document.getElementById('qrVerifyVideo');
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
    }

    if (scannedId === currentTargetId) {
      try {
        await bookings.verifyPayment(currentTargetId);
        const res = await bookings.getAll();
        state.bookings = res.data;
        qrModal.classList.add('hidden');
        renderFn();
        showAdminToast("Payment Confirmed! QR matched successfully.", "success");
      } catch (err) {
        showAdminToast(err.response?.data?.error || "Error verifying payment", "error");
        qrModal.classList.add('hidden');
      }
    } else {
      showAdminToast("Verification Failed! Scanned QR does not match.", "error");
      qrModal.classList.add('hidden');
    }
  }

  // Settings Form Handler
  const settingsForm = document.getElementById('settingsForm');
  if (settingsForm) {
    settingsForm.onsubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(settingsForm);
      const email = formData.get('email');
      const name = formData.get('name');
      const phone = formData.get('phone');
      const password = formData.get('password');

      try {
        const res = await users.updateProfile({ email, name, phone, password });
        showAdminToast(res.data.message, "success");
        // Update local state
        state.user.email = email;
        state.user.name = name;
        state.user.phone = phone;
        // Optional: clear password field
        settingsForm.querySelector('input[name="password"]').value = '';
        renderFn(); // Re-render to show updated name in header/sidebar
      } catch (err) {
        showAdminToast(err.response?.data?.error || "Update failed", "error");
      }
    };
  }
}
