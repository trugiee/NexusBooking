export const state = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  currentView: 'login',
  customerSubView: 'home',
  selectedDate: null,
  isSidebarCollapsed: false,
  users: [],
  cottages: [],
  bookings: [],
  addons: [],
  bookingStep: 'idle',
  currentBooking: {
    cottageId: null,
    date: null,
    price: 0,
    selectedAddons: [],
    total: 0,
    transactionId: ''
  },
  adminTab: 'home'
};

export function navigate(view, renderFn) {
  state.currentView = view;
  renderFn();
  window.scrollTo(0, 0);
}

export function checkAuth() {
  if (!state.user && state.currentView !== 'login') {
    state.currentView = 'login';
  }
}
