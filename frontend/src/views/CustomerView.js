import { state, navigate } from '../state.js';
import { bookings, payments, users } from '../api.js';

// Removed local booking variables - now using state.js

export function renderCustomer() {
  document.body.classList.remove('landing-page');
  if (!state.user) return ''; 
  
  const today = new Date().toISOString().split('T')[0];
  const activeSubView = state.customerSubView || 'home';
  
  // Set default view to 'home' if not set
  if (!state.customerSubView) state.customerSubView = 'home';

  return `
    <div class="min-h-screen py-6 px-4 sm:py-12 sm:px-6 md:py-20 md:px-8 flex flex-col items-center">
      
      <!-- High-Visibility Sanctuary Container -->
      <div class="w-full max-w-6xl bg-white rounded-[2rem] sm:rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.15)] p-6 sm:p-10 md:p-12 lg:p-16 space-y-10 border border-slate-100 animate-scale-up">
        
        <!-- Header -->
        <header class="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b-2 border-slate-100 gap-6">
           <div>
              <h1 class="text-3xl sm:text-4xl font-black text-black tracking-tighter italic">Hi, ${state.user ? state.user.name.split(' ')[0] : 'Guest'}!</h1>
              <p class="text-[10px] font-black text-black uppercase tracking-[0.4em] mt-2">
                 Welcome to your NEXUS<span class="text-emerald-500">7101</span> Booking Panel
              </p>
           </div>
           <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div class="flex bg-black/5 p-1.5 rounded-2xl">
                <button id="viewHome" class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubView === 'home' ? 'bg-black text-white shadow-md' : 'text-black/40 hover:text-black'}">
                  Explore
                </button>
                <button id="viewHistory" class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubView === 'history' ? 'bg-black text-white shadow-md' : 'text-black/40 hover:text-black'}">
                  History
                </button>
                <button id="viewSettings" class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubView === 'settings' ? 'bg-black text-white shadow-md' : 'text-black/40 hover:text-black'}">
                  Settings
                </button>
              </div>
              <button id="logoutBtn" class="ml-auto md:ml-4 text-[10px] font-black uppercase tracking-[0.2em] text-black/40 hover:text-emerald-500 transition-colors">Logout</button>
           </div>
        </header>

        ${activeSubView === 'home' ? renderHomeView(today) : activeSubView === 'history' ? renderHistoryView() : activeSubView === 'settings' ? renderSettingsView() : ''}

        <div class="pt-10 text-center">
           <p class="text-[10px] font-black text-black/20 uppercase tracking-[0.6em]">NEXUS7101 Website Booking</p>
        </div>
      </div>

      <!-- Multi-Step Booking Modal -->
      <div id="bookingModal" class="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200] ${state.bookingStep === 'idle' ? 'hidden' : ''} flex items-center justify-center p-6">
        <div class="bg-white max-w-md w-full p-8 md:p-12 rounded-[3.5rem] shadow-3xl animate-scale-up border-2 border-white overflow-hidden relative">
           ${renderModalContent()}
        </div>
      </div>
    </div>
  `;
}

function renderHomeView(today) {
  const displayDate = state.selectedDate || today;
  const bookedOnDate = state.bookings.filter(b => b.date === displayDate && b.status !== 'Cancelled').map(b => Number(b.cottageId));
  
  // Logic for calendar
  const now = new Date();
  const currentYear = state.viewYear || now.getFullYear();
  const currentMonth = state.viewMonth !== undefined ? state.viewMonth : now.getMonth();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  return `
    <div class="grid lg:grid-cols-12 gap-12 animate-fade-in">
      <!-- Calendar Section -->
      <div class="lg:col-span-5 space-y-8">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-black text-black tracking-tighter italic">Select Date.</h2>
            <p class="text-[10px] font-black text-black/60 uppercase tracking-widest mt-1">${monthNames[currentMonth]} ${currentYear}</p>
          </div>
          <div class="flex gap-2">
            <button id="prevMonth" class="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-500 hover:text-black">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button id="nextMonth" class="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-500 hover:text-black">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>

        <div class="bg-slate-50/50 rounded-[2.5rem] p-6 border border-slate-100">
          <div class="grid grid-cols-7 gap-1 mb-4">
            ${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => `<div class="text-center text-[10px] font-black text-black/40 py-2">${d}</div>`).join('')}
            ${generateCalendarDays(currentYear, currentMonth, displayDate)}
          </div>
          <div class="flex items-center gap-4 mt-6 pt-6 border-t border-slate-100">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-black"></div>
              <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Selected</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest">Fully Booked</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Cottages Section -->
      <div class="lg:col-span-7 space-y-8">
        <div>
          <h2 class="text-6xl font-black text-black tracking-tighter italic leading-none mb-2">Available Cottages.</h2>
          <p class="text-[10px] font-black text-black/40 uppercase tracking-[0.4em] mt-2 italic flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            ${displayDate === today ? 'TODAY, ' : ''}${new Date(displayDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
          ${state.cottages.filter(c => c.active && !bookedOnDate.includes(c.id)).map(c => `
              <div 
                class="cottage-card group transition-all relative cursor-pointer hover:-translate-y-2"
                data-id="${c.id}" data-price="${c.price}" data-date="${displayDate}"
              >
                <div class="aspect-[4/5] bg-slate-50 rounded-[2rem] flex flex-col items-center justify-center border-2 border-slate-100 transition-all group-hover:bg-black group-hover:border-black group-hover:shadow-2xl group-hover:shadow-black/20 overflow-hidden">
                   <div class="absolute top-4 left-4">
                     <span class="text-[10px] font-black text-slate-500 group-hover:text-black/40 uppercase tracking-widest transition-colors">#${c.id}</span>
                   </div>
                   <div class="space-y-1 text-center px-4">
                     <p class="text-sm font-black text-black group-hover:text-white transition-colors">${c.category}</p>
                     <p class="text-[10px] font-black text-slate-600 group-hover:text-black/40 transition-colors">₱${c.price.toLocaleString()}</p>
                   </div>
                </div>
              </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderHistoryView() {
  return `
    <div class="space-y-10 animate-fade-in max-w-4xl mx-auto">
      <div class="text-center">
        <h2 class="text-3xl font-black text-black tracking-tighter italic">My Bookings.</h2>
        <p class="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mt-2">All your sanctuary reservations</p>
      </div>

      <div class="grid gap-6">
        ${state.bookings.filter(b => b.userId === (state.user?.id)).length === 0 ? `
          <div class="bg-slate-50 p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
            <p class="text-slate-600 font-black uppercase tracking-widest text-xs">No bookings found yet</p>
          </div>
        ` : state.bookings.filter(b => b.userId === (state.user?.id)).map(b => `
          <div class="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-wrap items-center justify-between gap-6 hover:border-black hover:shadow-xl hover:shadow-black/5 transition-all group">
            <div class="flex items-center gap-8">
              <div class="w-16 h-16 bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
                <span class="text-[9px] font-black uppercase opacity-70">ID</span>
                <span class="text-xl font-black">#${b.cottageId}</span>
              </div>
              <div>
                <p class="text-xl font-black text-black tracking-tighter">${new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                <p class="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">Ref: ${b.id.substring(0, 8)} • ₱${b.total.toLocaleString()}</p>
              </div>
            </div>
            <div class="flex items-center gap-6">
              <div class="text-right">
                <span class="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : b.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-rose-700 border border-rose-200'}">
                  ${b.status}
                </span>
              </div>
              <button class="view-receipt-btn bg-black text-white text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-black transition-all shadow-lg active:scale-95" data-id="${b.id}">
                Pass
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function generateCalendarDays(year, month, selectedDate) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  
  // Empty slots for previous month
  for (let i = 0; i < firstDay; i++) {
    days.push('<div class="aspect-square"></div>');
  }
  
  const today = new Date().toISOString().split('T')[0];
  const numCottages = state.cottages.filter(c => c.active).length;

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isSelected = dateStr === selectedDate;
    const isPast = dateStr < today;
    
    // Check if fully booked (Pending + Confirmed)
    const bookedCount = state.bookings.filter(b => b.date === dateStr && b.status !== 'Cancelled').length;
    const isFullyBooked = bookedCount >= numCottages && numCottages > 0;

    days.push(`
      <div 
        class="calendar-day aspect-square flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-all relative group
        ${isSelected ? 'bg-black text-white shadow-lg z-10' : 'hover:bg-slate-200'} 
        ${isPast ? 'opacity-30 pointer-events-none' : 'text-slate-800'}
        ${isFullyBooked && !isSelected ? 'text-emerald-600 font-black' : ''}"
        data-date="${dateStr}"
      >
        <span class="text-sm font-bold">${d}</span>
        ${isFullyBooked ? '<div class="absolute bottom-1.5 w-1 h-1 rounded-full bg-emerald-600"></div>' : ''}
        ${isSelected ? '' : bookedCount > 0 && bookedCount < numCottages ? '<div class="absolute bottom-1.5 w-1 h-1 rounded-full bg-emerald-500"></div>' : ''}
      </div>
    `);
  }
  
  return days.join('');
}


function renderModalContent() {
  switch (state.bookingStep) {
    case 'addons':
      return `
        <div class="space-y-8">
          <div class="text-center">
            <h3 class="text-3xl font-black text-black tracking-tighter italic">Enhance Your Stay.</h3>
            <p class="text-[10px] font-black text-black/40 uppercase tracking-widest mt-2">Cottage #${state.currentBooking.cottageId} • ${state.currentBooking.date}</p>
          </div>
          
          <div class="space-y-4">
            ${state.addons.map(addon => {
        // Ensure comparison works regardless of type (string vs number)
        const isSelected = state.currentBooking.selectedAddons.some(id => String(id) === String(addon.id));
        return `
                <div class="addon-toggle p-6 rounded-3xl border-2 transition-all cursor-pointer flex justify-between items-center ${isSelected ? 'border-black bg-black text-white shadow-lg' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-300'}" data-id="${addon.id}">
                  <div>
                    <p class="font-black text-lg">${addon.name}</p>
                    <p class="text-[10px] uppercase font-bold opacity-60">Add ₱${addon.price.toLocaleString()}</p>
                  </div>
                  <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-white bg-white' : 'border-slate-300'}">
                    ${isSelected ? '<svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>' : ''}
                  </div>
                </div>
              `;
      }).join('')}
          </div>

          <div class="pt-4 space-y-4">
            <button id="goToPayment" class="w-full bg-black text-white font-black py-6 rounded-2xl hover:bg-black transition-all active:scale-95 shadow-2xl shadow-black/20">Review & Pay</button>
            <button id="closeModal" class="w-full text-xs font-black text-black/40 uppercase tracking-[0.2em] hover:text-black transition-colors text-center">Cancel</button>
          </div>
        </div>
      `;

    case 'payment':
      const addonsTotal = state.currentBooking.selectedAddons.reduce((sum, id) => {
        const addon = state.addons.find(a => a.id === id);
        return sum + (addon ? addon.price : 0);
      }, 0);
      state.currentBooking.total = state.currentBooking.price + addonsTotal;

      return `
        <div class="space-y-8 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
          <div class="text-center">
            <h3 class="text-3xl font-black text-black tracking-tighter italic">Payment Details.</h3>
          </div>

          <div class="bg-slate-50 rounded-[2.5rem] p-8 space-y-4 border border-slate-100">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-black text-black/40 uppercase">Cottage #${state.currentBooking.cottageId}</span>
              <span class="font-black text-black">₱${state.currentBooking.price.toLocaleString()}</span>
            </div>
            ${state.currentBooking.selectedAddons.map(id => {
        const addon = state.addons.find(a => a.id === id);
        return `
                <div class="flex justify-between items-center text-slate-500">
                  <span class="text-[10px] font-black uppercase">+ ${addon.name}</span>
                  <span class="font-bold text-sm">₱${addon.price.toLocaleString()}</span>
                </div>
              `;
      }).join('')}
            <div class="h-px bg-slate-200 w-full my-2"></div>
            <div class="flex justify-between items-center pt-2">
              <span class="text-xs font-black text-black uppercase tracking-widest">Total Amount</span>
              <span class="text-3xl font-black text-black tracking-tighter">₱${state.currentBooking.total.toLocaleString()}</span>
            </div>
          </div>

            <button id="payGCash" class="w-full bg-[#0055ff] text-white font-black py-6 rounded-2xl hover:bg-[#0044cc] transition-all active:scale-95 shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
              Pay via GCash Online
            </button>
            <div class="relative flex items-center justify-center">
               <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200"></div></div>
               <span class="relative bg-white px-4 text-[10px] font-black text-black/40 uppercase tracking-widest">OR</span>
            </div>
            <button id="payAtCityHall" class="w-full bg-slate-100 text-black font-black py-6 rounded-2xl hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-3 border-2 border-slate-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              Pay Cash at City Hall
            </button>
            <button id="backToAddons" class="w-full text-xs font-black text-black/40 uppercase tracking-[0.2em] hover:text-black transition-colors text-center">Back to Add-ons</button>
          </div>
        </div>
      `;

    case 'success':
      return `
        <div class="text-center space-y-8 py-10 animate-scale-up">
           <div class="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40 animate-bounce">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"></path></svg>
           </div>
           
           <div class="space-y-3">
              <h3 class="text-4xl font-black text-black tracking-tighter italic">Reservation Saved!</h3>
              <p class="text-sm font-bold text-slate-500 max-w-[280px] mx-auto leading-relaxed">Thank you for choosing <span class="text-black font-black">NEXUS7101</span>. Please proceed to City Hall to settle your cash payment.</p>
           </div>

           <div class="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
              <p class="text-[9px] font-black text-black/40 uppercase tracking-[0.3em] mb-2">Next Step</p>
              <p class="text-[11px] font-bold text-slate-700">Present your <span class="text-black font-black italic">TRX-ID</span> or <span class="text-black font-black italic">QR Pass</span> to the City Hall Admin for quick verification.</p>
           </div>

           <button id="viewPassFromSuccess" class="w-full bg-black text-white font-black py-6 rounded-2xl hover:bg-black transition-all active:scale-95 shadow-2xl shadow-black/20">
              View Digital Pass
           </button>
        </div>
      `;

    case 'receipt':
      const qrData = state.currentBooking.transactionId;
      const booking = state.bookings.find(b => b.id === state.currentBooking.transactionId);

      return `
        <div class="space-y-8 max-h-[80vh] overflow-y-auto pr-2">
          <div class="text-center">
             <div class="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/20">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
             </div>
             <h3 class="text-3xl font-black text-black tracking-tighter italic">Digital Pass Ready</h3>
             <p class="text-[10px] font-black text-black/40 uppercase tracking-widest mt-2">Show this to the guard upon arrival</p>
          </div>

          <div id="receiptToDownload" class="bg-white border-2 border-black rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 space-y-6 md:space-y-8 relative overflow-hidden text-center shadow-2xl">
             <!-- Ticket Notches -->
             <div class="absolute -left-4 md:-left-5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-slate-100 rounded-full border-r-2 border-black"></div>
             <div class="absolute -right-4 md:-right-5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-slate-100 rounded-full border-l-2 border-black"></div>

             <div class="space-y-2">
                <p class="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">OFFICIAL QR PASS</p>
                <div class="bg-white p-2 md:p-4 rounded-2xl md:rounded-3xl inline-block border-2 border-slate-100">
                   <canvas id="qrCanvas"></canvas>
                </div>
                <p class="text-[10px] md:text-xs font-black text-black mt-4 tracking-widest break-all">${qrData}</p>
             </div>

             <div class="grid grid-cols-2 gap-4 pt-4 border-t-2 border-dashed border-slate-100">
                <div class="text-left">
                   <p class="text-[9px] md:text-[10px] font-black text-black/40 uppercase tracking-tighter">Cottage No.</p>
                   <p class="text-lg md:text-xl font-black text-black">#${state.currentBooking.cottageId}</p>
                </div>
                <div class="text-right">
                   <p class="text-[9px] md:text-[10px] font-black text-black/40 uppercase tracking-tighter">Reservation Date</p>
                   <p class="text-lg md:text-xl font-black text-black">${state.currentBooking.date}</p>
                </div>
             </div>

             <div class="pt-2 md:pt-4">
                <div class="bg-black text-white rounded-xl md:rounded-2xl py-2 md:py-3 px-4 md:px-6 inline-block">
                   <p class="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Status: ${state.currentBooking.status || 'Verified'}</p>
                </div>
             </div>
          </div>

          <div class="space-y-4">
            <button id="downloadPass" class="w-full bg-emerald-500 text-white font-black py-6 rounded-2xl hover:bg-emerald-600 transition-all active:scale-95 shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-3">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Download Pass (PNG)
            </button>
            <button id="finishBooking" class="w-full bg-black text-white font-black py-6 rounded-2xl hover:bg-black transition-all active:scale-95 shadow-2xl shadow-black/20">Return to Home</button>
          </div>
        </div>
      `;

    default:
      return '';
  }
}

export function attachCustomerListeners(renderFn) {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.onclick = () => {
    state.user = null;
    state.token = null;
    state.bookings = [];
    state.cottages = [];
    state.users = [];
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('login', renderFn);
  };

  const viewHome = document.getElementById('viewHome');
  if (viewHome) viewHome.onclick = () => {
    state.customerSubView = 'home';
    renderFn();
  };

  const viewHistory = document.getElementById('viewHistory');
  if (viewHistory) viewHistory.onclick = () => {
    state.customerSubView = 'history';
    renderFn();
  };

  const viewSettings = document.getElementById('viewSettings');
  if (viewSettings) viewSettings.onclick = () => {
    state.customerSubView = 'settings';
    renderFn();
  };

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
        alert(res.data.message);
        state.user.email = email;
        state.user.name = name;
        state.user.phone = phone;
        settingsForm.querySelector('input[name="password"]').value = '';
        renderFn();
      } catch (err) {
        alert(err.response?.data?.error || "Update failed");
      }
    };
  }

  // Calendar Listeners
  const prevMonth = document.getElementById('prevMonth');
  if (prevMonth) prevMonth.onclick = () => {
    const now = new Date();
    if (state.viewMonth === undefined) {
      state.viewMonth = now.getMonth();
      state.viewYear = now.getFullYear();
    }
    state.viewMonth--;
    if (state.viewMonth < 0) {
      state.viewMonth = 11;
      state.viewYear--;
    }
    renderFn();
  };

  const nextMonth = document.getElementById('nextMonth');
  if (nextMonth) nextMonth.onclick = () => {
    const now = new Date();
    if (state.viewMonth === undefined) {
      state.viewMonth = now.getMonth();
      state.viewYear = now.getFullYear();
    }
    state.viewMonth++;
    if (state.viewMonth > 11) {
      state.viewMonth = 0;
      state.viewYear++;
    }
    renderFn();
  };

  const calendarDays = document.querySelectorAll('.calendar-day[data-date]');
  calendarDays.forEach(day => {
    day.onclick = () => {
      state.selectedDate = day.dataset.date;
      renderFn();
    };
  });

  // Cottage selection
  const cottageCards = document.querySelectorAll('.cottage-card[data-id]');
  cottageCards.forEach(card => {
    card.onclick = () => {
      state.currentBooking = {
        cottageId: Number(card.dataset.id),
        date: card.dataset.date,
        price: Number(card.dataset.price),
        selectedAddons: [],
        total: 0,
        transactionId: ''
      };
      state.bookingStep = 'addons';
      renderFn();
    };
  });

  // Modal actions
  const closeBtn = document.getElementById('closeModal');
  if (closeBtn) closeBtn.onclick = () => {
    state.bookingStep = 'idle';
    renderFn();
  };

  // Addon toggles
  const addonToggles = document.querySelectorAll('.addon-toggle');
  addonToggles.forEach(toggle => {
    toggle.onclick = () => {
      const id = Number(toggle.dataset.id); 
      if (state.currentBooking.selectedAddons.includes(id)) {
        state.currentBooking.selectedAddons = state.currentBooking.selectedAddons.filter(a => a !== id);
      } else {
        state.currentBooking.selectedAddons.push(id);
      }
      renderFn();
    };
  });

  const goToPayment = document.getElementById('goToPayment');
  if (goToPayment) goToPayment.onclick = () => {
    state.bookingStep = 'payment';
    renderFn();
  };

  const backToAddons = document.getElementById('backToAddons');
  if (backToAddons) backToAddons.onclick = () => {
    state.bookingStep = 'addons';
    renderFn();
  };

  const payGCash = document.getElementById('payGCash');
  if (payGCash) payGCash.onclick = async () => {
    try {
      const bookingRes = await bookings.create({
        cottageId: state.currentBooking.cottageId,
        date: state.currentBooking.date,
        addons: state.currentBooking.selectedAddons,
        total: state.currentBooking.total,
        paymentMethod: 'GCash'
      });

      state.currentBooking.transactionId = bookingRes.data.id;

      const checkoutRes = await payments.createCheckout({
        amount: state.currentBooking.total,
        description: `Cottage #${state.currentBooking.cottageId} Reservation`,
        bookingId: bookingRes.data.id,
        origin: window.location.origin
      });

      if (checkoutRes.data.checkout_url) {
        window.location.href = checkoutRes.data.checkout_url;
      } else {
        alert("Payment gateway error");
      }
    } catch (error) {
      console.error("Booking Error:", error);
      const msg = error.response?.data?.error || "Failed to create booking.";
      alert(msg);
    }
  };

  const payAtCityHall = document.getElementById('payAtCityHall');
  if (payAtCityHall) payAtCityHall.onclick = async () => {
    try {
      const bookingRes = await bookings.create({
        cottageId: state.currentBooking.cottageId,
        date: state.currentBooking.date,
        addons: state.currentBooking.selectedAddons,
        total: state.currentBooking.total,
        paymentMethod: 'Cash at City Hall'
      });

      state.currentBooking.transactionId = bookingRes.data.id;
      state.currentBooking.status = 'Pending';
      
      const allRes = await bookings.getAll();
      state.bookings = allRes.data;

      state.bookingStep = 'success';
      renderFn();
    } catch (error) {
      console.error("Booking Error:", error);
      alert(error.response?.data?.error || "Failed to create reservation.");
    }
  };

  const viewReceiptBtns = document.querySelectorAll('.view-receipt-btn, #viewLatestReceipt');
  viewReceiptBtns.forEach(btn => {
    btn.onclick = () => {
      let bookingId = btn.dataset.id;
      let targetBooking;
      
      if (bookingId) {
        targetBooking = state.bookings.find(b => b.id === bookingId);
      } else {
        targetBooking = state.bookings.find(b => b.userId === (state.user?.id));
      }

      if (targetBooking) {
        state.currentBooking = {
          cottageId: targetBooking.cottageId,
          date: targetBooking.date,
          price: targetBooking.total, 
          selectedAddons: targetBooking.addons || [],
          total: targetBooking.total,
          transactionId: targetBooking.id,
          status: targetBooking.status
        };
        state.bookingStep = 'receipt';
        renderFn();
      }
    };
  });

  const viewPassFromSuccess = document.getElementById('viewPassFromSuccess');
  if (viewPassFromSuccess) viewPassFromSuccess.onclick = () => {
    state.bookingStep = 'receipt';
    renderFn();
  };

  const finishBooking = document.getElementById('finishBooking');
  if (finishBooking) finishBooking.onclick = () => {
    state.bookingStep = 'idle';
    renderFn();
  };

  const downloadBtn = document.getElementById('downloadPass');
  if (downloadBtn) {
    if (state.bookingStep === 'receipt') {
      const qrCanvas = document.getElementById('qrCanvas');
      if (qrCanvas && typeof QRious !== 'undefined') {
        new QRious({
          element: qrCanvas,
          value: state.currentBooking.transactionId,
          size: 160,
          level: 'H'
        });
      }
    }

    downloadBtn.onclick = async () => {
      if (typeof html2canvas === 'undefined') {
        alert("System still loading components... Please wait 3 seconds and try again.");
        return;
      }

      const receipt = document.getElementById('receiptToDownload');
      if (!receipt) return;
      
      const btn = downloadBtn;
      btn.disabled = true;
      btn.innerHTML = "Generating Image...";

      try {
        const originalTransform = receipt.style.transform;
        receipt.style.transform = 'none';

        const canvas = await html2canvas(receipt, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          imageTimeout: 0
        });
        
        const link = document.createElement('a');
        link.download = `Booking_Pass_${state.currentBooking.transactionId}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        btn.innerHTML = "Download Pass (PNG)";
      } catch (err) {
        console.error("Download Error:", err);
        alert("Failed to download. Please take a screenshot for now.");
        btn.innerHTML = "Download Pass (PNG)";
      } finally {
        btn.disabled = false;
        const receipt = document.getElementById('receiptToDownload');
        if (receipt) receipt.style.transform = '';
      }
    };
  }
}

function renderSettingsView() {
  return `
    <div class="max-w-2xl mx-auto space-y-12 animate-fade-in py-10">
      <header class="text-center">
        <h2 class="text-6xl font-black text-black tracking-tighter italic">Settings.</h2>
        <p class="text-[10px] font-black text-black/40 uppercase tracking-[0.5em] mt-2 italic">Update your NEXUS7101 Account</p>
      </header>

      <div class="bg-white p-10 md:p-14 rounded-[3.5rem] border border-black/5 shadow-2xl shadow-black/5">
        <form id="settingsForm" class="space-y-8">
           <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div class="space-y-3">
                <label class="text-[10px] font-black text-black/40 uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" name="name" value="${state.user.name}" class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 font-bold text-black focus:border-black outline-none transition-all" required>
             </div>
             <div class="space-y-3">
                <label class="text-[10px] font-black text-black/40 uppercase tracking-widest ml-1">Phone Number</label>
                <input type="text" name="phone" value="${state.user.phone || ''}" class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 font-bold text-black focus:border-black outline-none transition-all" placeholder="09123456789">
             </div>
           </div>

           <div class="space-y-3">
              <label class="text-[10px] font-black text-black/40 uppercase tracking-widest ml-1">Email Address (Gmail)</label>
              <input type="email" name="email" value="${state.user.email}" class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 font-bold text-black focus:border-black outline-none transition-all" required>
           </div>
           
           <div class="space-y-3">
              <label class="text-[10px] font-black text-black/40 uppercase tracking-widest ml-1">New Password (Leave blank to keep current)</label>
              <input type="password" name="password" placeholder="••••••••" class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 font-bold text-black focus:border-black outline-none transition-all">
           </div>

           <div class="pt-4">
             <button type="submit" class="w-full py-5 bg-black text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-black/10 active:scale-95">Update Profile</button>
           </div>
        </form>
      </div>
    </div>
  `;
}
