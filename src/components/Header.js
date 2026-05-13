import { state, navigate } from '../state.js';

export function renderHeader(title, subtitle) {
  return `
    <header class="flex justify-between items-center mb-12 animate-fade-in bg-black p-8 rounded-[2.5rem] text-white shadow-2xl shadow-black/20">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/10 overflow-hidden group-hover:scale-105 transition-transform">
           <img src="/logo.png" class="w-full h-full object-cover p-2">
        </div>
        <div>
           <h2 class="text-3xl font-black text-white tracking-[ -0.05em] uppercase italic leading-none">NEXUS<span class="text-white/40">7101</span></h2>
           <p class="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] mt-1 italic">Website Booking</p>
        </div>
      </div>
      <div class="flex items-center gap-6">
        ${state.user?.role !== 'customer' ? `
          <div class="hidden sm:flex flex-col text-right">
             <span class="text-sm font-black text-white">${state.user?.name || 'Admin'}</span>
             <span class="text-xs font-bold text-white/40 uppercase tracking-widest">${state.user?.role || 'Staff'}</span>
          </div>
        ` : ''}
        <button id="logoutBtn" class="p-3 rounded-2xl bg-white/10 shadow-lg text-white/40 hover:text-emerald-500 transition-all border border-white/10 group">
          <svg class="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
        </button>
      </div>
    </header>
  `;
}

export function attachHeaderListeners(renderFn) {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('login', renderFn);
    };
  }
}
