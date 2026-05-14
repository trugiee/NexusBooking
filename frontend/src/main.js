import './style.css';
import { state, checkAuth } from './state.js';
import { renderLogin, attachLoginListeners } from './views/LoginView.js';
import { renderCustomer, attachCustomerListeners } from './views/CustomerView.js';
import { renderAdmin, attachAdminListeners, attachSystemCharts } from './views/AdminView.js';
import { renderInspector, attachInspectorListeners } from './views/InspectorView.js';
import { cottages, bookings, addons } from './api.js';

export async function initData() {
  try {
    const cottageRes = await cottages.getAll();
    state.cottages = cottageRes.data;

    const addonRes = await addons.getAll();
    state.addons = addonRes.data;

    if (state.token) {
      const bookingRes = await bookings.getAll();
      state.bookings = bookingRes.data;

      // Fetch users if admin
      if (state.user && state.user.role === 'admin') {
        const { admin } = await import('./api.js');
        const userRes = await admin.getUsers();
        state.users = userRes.data;
      }
    }
  } catch (err) {
    console.error("Failed to fetch initial data", err);
  }
}

async function render() {
  const app = document.getElementById('app');
  
  // Handle GCash Return
  const urlParams = new URLSearchParams(window.location.search);
  let status = urlParams.get('status') || sessionStorage.getItem('paymentStatus');
  let bookingId = urlParams.get('id') || sessionStorage.getItem('paymentBookingId');
  
  if (urlParams.get('status')) {
    sessionStorage.setItem('paymentStatus', urlParams.get('status'));
    sessionStorage.setItem('paymentBookingId', urlParams.get('id'));
  }

  let skipAuth = false;

  if (status === 'success' && bookingId) {
    console.log("Instant Receipt Mode Activated!");
    
    // Update status in background via verification
    if (state.token) {
      bookings.verifyPayment(bookingId).catch((err) => console.error("Auto-verification failed", err));
    }

    // Force prepare state to show receipt
    state.currentBooking = {
      transactionId: bookingId,
      cottageId: bookingId.split('-')[1] || '?',
      date: 'Today',
      total: 0,
      status: 'Confirmed' // Force local status
    };

    const found = state.bookings.find(b => b.id === bookingId);
    if (found) {
      found.status = 'Confirmed'; // Update local memory
      state.currentBooking = { ...found, transactionId: found.id, status: 'Confirmed' };
    }

    state.bookingStep = 'receipt';
    state.currentView = 'customer';
    skipAuth = true;

    // Clear session storage immediately so it doesn't pop up again on refresh
    sessionStorage.removeItem('paymentStatus');
    sessionStorage.removeItem('paymentBookingId');

    // Clean up URL
    if (urlParams.get('status')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  if (!skipAuth) {
    checkAuth();
  }
  
  switch (state.currentView) {
    case 'login':
      app.innerHTML = renderLogin();
      attachLoginListeners(render);
      break;
    case 'customer':
      app.innerHTML = renderCustomer();
      attachCustomerListeners(render);
      break;
    case 'admin':
      app.innerHTML = renderAdmin();
      attachAdminListeners(render);
      if ((state.adminTab || 'home') === 'system') attachSystemCharts();
      break;
    case 'inspector':
      app.innerHTML = renderInspector();
      attachInspectorListeners(render);
      break;
  }
}

// Initialize
initData().then(() => render());
