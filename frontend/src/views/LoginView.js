import { state, navigate } from '../state.js';
import { initData } from '../main.js';
import { auth } from '../api.js';

let activePanel = 'login'; 

export function renderLogin() {
  document.body.classList.add('landing-page');
  const activePanel = state.loginPanel || 'login';
  return `
    <div class="min-h-screen bg-transparent flex items-center justify-center p-4 md:p-12 overflow-y-auto">

      <div class="relative w-full max-w-[1100px] bg-white rounded-[2rem] md:rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] overflow-hidden border border-white mt-6 md:mt-0 md:h-[85vh] md:min-h-[650px]" id="authContainer">

        <!-- Sign Up Form -->
        <div class="absolute top-0 left-0 min-h-full md:h-full w-full md:w-1/2 transition-all duration-700 ease-in-out z-10 opacity-0 pointer-events-none" id="signupPanel">
          <form id="signupForm" class="min-h-full flex flex-col justify-center px-8 md:px-12 space-y-3 overflow-y-auto py-10">
            <!-- Mobile App Title -->
            <div class="md:hidden flex items-center gap-2 mb-4">
              <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-slate-100">
                <img src="/logo.png" class="w-full h-full object-cover p-1">
              </div>
              <h1 class="text-xl font-black text-slate-900 tracking-tighter uppercase italic">NEXUS<span class="text-slate-400">7101</span></h1>
            </div>

            <h2 class="text-3xl font-black text-slate-900 mb-1">Create Account</h2>
            <div class="grid grid-cols-2 gap-3">
              <input type="text" id="firstName" class="input-field py-2 text-xs" placeholder="First Name" required>
              <input type="text" id="lastName" class="input-field py-2 text-xs" placeholder="Last Name" required>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Birthday</label>
                <input type="date" id="birthday" class="input-field py-2 text-xs w-full" required>
              </div>
              <div class="space-y-1">
                <label class="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                <input type="tel" id="phoneSignup" class="input-field py-2 text-xs" placeholder="0912..." required>
              </div>
            </div>
            <textarea id="address" class="input-field py-2 text-xs h-14 resize-none" placeholder="Complete Address" required></textarea>
            <input type="email" id="emailSignup" class="input-field py-2 text-xs" placeholder="Email Address" required>
            <div class="grid grid-cols-2 gap-3">
              <input type="password" id="passSignup" class="input-field py-2 text-xs" placeholder="Password" required>
              <input type="password" id="confirmPass" class="input-field py-2 text-xs" placeholder="Confirm" required>
            </div>
            <div class="pt-2 border-t border-slate-100">
              <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Identity Verification (ID Photo)</label>
              <div id="idStatus" class="mb-2 p-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                <p id="idStatusText" class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">No ID Provided Yet</p>
                <img id="idPreview" class="hidden w-full h-24 object-cover rounded-xl mt-2 border border-white shadow-sm">
              </div>
              <div class="flex gap-2">
                <button type="button" id="openCamera" class="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Camera</button>
                <button type="button" id="uploadBtn" class="flex-1 py-3 bg-slate-100 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Upload</button>
                <input type="file" id="fileInput" class="hidden" accept="image/*">
              </div>
            </div>
            <button type="submit" class="w-full btn-primary py-3 mt-2">Create &amp; Request Approval</button>
            <p class="md:hidden text-center text-xs text-slate-400 pt-2">Already have an account? <button type="button" id="mobileToLoginBottom" class="font-black text-slate-900 underline">Sign In</button></p>
          </form>
        </div>

        <div class="absolute top-0 left-0 min-h-full md:h-full w-full md:w-1/2 transition-all duration-700 ease-in-out z-20" id="loginPanel">
          <form id="loginForm" class="min-h-full flex flex-col justify-center px-8 md:px-12 space-y-6 overflow-y-auto py-10">
            <!-- Mobile App Title -->
            <div class="md:hidden flex items-center gap-2 mb-2">
              <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-slate-100">
                <img src="/logo.png" class="w-full h-full object-cover p-1">
              </div>
              <h1 class="text-xl font-black text-slate-900 tracking-tighter uppercase italic">NEXUS<span class="text-slate-400">7101</span></h1>
            </div>

            <h2 class="text-3xl font-black text-slate-900 mb-2">Sign In</h2>
            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input type="email" id="emailLogin" class="input-field" placeholder="email@example.com" value="customer@example.com" required>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <input type="password" id="passLogin" class="input-field" placeholder="••••••••" value="password" required>
              </div>
            </div>
            <button type="submit" class="w-full btn-primary py-4">Sign In</button>
            <div class="relative flex py-2 items-center">
                <div class="flex-grow border-t border-slate-100"></div>
                <span class="flex-shrink mx-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Or continue with</span>
                <div class="flex-grow border-t border-slate-100"></div>
            </div>
            <div id="googleBtnContainer" class="w-full flex justify-center"></div>
            <p class="text-center text-sm text-slate-400">Forget your password?</p>
            <p class="md:hidden text-center text-xs text-slate-400">New here? <button type="button" id="mobileToSignupBottom" class="font-black text-slate-900 underline">Create Account</button></p>
          </form>
        </div>

        <!-- Desktop Overlay (hidden on mobile) -->
        <div class="hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-700 ease-in-out z-[100]" id="overlayContainer">
          <div class="relative left-[-100%] h-full w-[200%] auth-overlay-bg text-white transition-all duration-700 ease-in-out transform" id="overlay">
            <div class="absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-16 text-center" id="overlayLeft">
              <div class="w-32 h-32 flex items-center justify-center mb-8">
                 <img src="/logo.png" class="w-full h-full object-contain filter invert brightness-200 mix-blend-screen">
              </div>
              <h2 class="text-5xl font-black mb-6 uppercase tracking-tighter italic">NEXUS<span class="text-white/40">7101</span></h2>
              <p class="text-white/90 text-lg mb-10">Already have an account?</p>
              <button id="toLogin" class="px-12 py-4 border-2 border-white rounded-full font-bold text-white hover:bg-white hover:text-slate-900 transition-all">Sign In</button>
            </div>
            <div class="absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-16 text-center" id="overlayRight">
              <div class="w-32 h-32 flex items-center justify-center mb-8">
                 <img src="/logo.png" class="w-full h-full object-contain filter invert brightness-200 mix-blend-screen">
              </div>
              <h2 class="text-5xl font-black mb-6 uppercase tracking-tighter italic">NEXUS<span class="text-white/40">7101</span></h2>
              <p class="text-white/90 text-lg mb-10 font-medium tracking-wide">New here? Sign up to book your stay!</p>
              <button id="toSignup" class="px-12 py-4 border-2 border-white rounded-full font-bold text-white hover:bg-white hover:text-slate-900 transition-all">Sign Up</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Camera Modal -->
      <div id="cameraModal" class="fixed inset-0 bg-slate-900/95 z-[200] hidden flex flex-col items-center justify-center p-6 backdrop-blur-md">
        <div class="relative w-full max-w-lg aspect-square overflow-hidden rounded-[3rem] border-4 border-white/10 shadow-3xl">
          <video id="cameraVideo" class="w-full h-full object-cover" autoplay playsinline></video>
          <div class="absolute inset-0 border-2 border-dashed border-white/20 m-12 rounded-[2rem] pointer-events-none"></div>
        </div>
        <div class="mt-8 flex gap-4 w-full max-w-lg">
          <button id="closeCamera" class="flex-1 px-8 py-5 bg-white/10 text-white font-black rounded-3xl hover:bg-white/20 transition-all uppercase tracking-widest text-xs">Cancel</button>
          <button id="capturePhoto" class="flex-1 px-8 py-5 bg-rose-500 text-white font-black rounded-3xl hover:scale-105 transition-all shadow-xl shadow-rose-500/20 uppercase tracking-widest text-xs">Capture ID</button>
        </div>
        <canvas id="cameraCanvas" class="hidden"></canvas>
      </div>

      <!-- Developer Credits Modal -->
      <div id="creditsModal" class="fixed inset-0 bg-slate-900/60 z-[300] hidden flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
        <div class="bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.3)] animate-zoom-in border border-white/20">
          
          <!-- Premium Gradient Header -->
          <div class="relative bg-gradient-to-br from-slate-900 via-slate-800 to-black p-10 text-white text-center overflow-hidden">
            <!-- Decorative Abstract Circles -->
            <div class="absolute top-[-10%] right-[-10%] w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div class="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
            
            <button id="closeCredits" class="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all z-10">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <div class="relative inline-block mb-6">
              <div class="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <img src="/logo.png" class="w-12 h-12 object-contain p-1">
              </div>
              <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center border-4 border-slate-900 shadow-lg">
                <div class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>

            <h3 class="text-3xl font-black italic tracking-tighter uppercase leading-none">NEXUS<span class="text-white/30">7101</span></h3>
            <div class="flex items-center justify-center gap-2 mt-2">
              <div class="h-px w-8 bg-white/10"></div>
              <p class="text-[9px] font-black text-emerald-400 uppercase tracking-[0.4em] italic">Development Team</p>
              <div class="h-px w-8 bg-white/10"></div>
            </div>
          </div>

          <!-- Team List with Hover Interactions -->
          <div class="p-10 space-y-2">
            
            <!-- Developer Row Template -->
            <div class="group flex items-center gap-5 p-4 rounded-[2rem] hover:bg-slate-50 transition-all duration-300 cursor-default border border-transparent hover:border-slate-100">
              <div class="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-slate-900/10">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <div>
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Frontend / Backend</p>
                <p class="text-base font-black text-slate-900 group-hover:text-emerald-600 transition-colors">TRUDGE INSONG</p>
              </div>
            </div>

            <div class="group flex items-center gap-5 p-4 rounded-[2rem] hover:bg-slate-50 transition-all duration-300 cursor-default border border-transparent hover:border-slate-100">
              <div class="w-12 h-12 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 border border-slate-200">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <div>
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Project Manager</p>
                <p class="text-base font-black text-slate-900 group-hover:text-emerald-600 transition-colors">APRIL GRACE LARANJO</p>
              </div>
            </div>

            <div class="group flex items-center gap-5 p-4 rounded-[2rem] hover:bg-slate-50 transition-all duration-300 cursor-default border border-transparent hover:border-slate-100">
              <div class="w-12 h-12 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-slate-200">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <div>
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Deployment</p>
                <p class="text-base font-black text-slate-900 group-hover:text-emerald-600 transition-colors">CHERRY MAE LIMBAGA</p>
              </div>
            </div>

            <div class="group flex items-center gap-5 p-4 rounded-[2rem] hover:bg-slate-50 transition-all duration-300 cursor-default border border-transparent hover:border-slate-100">
              <div class="w-12 h-12 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 border border-slate-200">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <div>
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Documentation</p>
                <p class="text-base font-black text-slate-900 group-hover:text-emerald-600 transition-colors">LANCE ENARDICIDO</p>
              </div>
            </div>

          </div>

          <div class="p-8 bg-slate-50 text-center border-t border-slate-100">
            <p class="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] leading-relaxed">
              Crafted with Excellence <br> 
              <span class="text-slate-900">© 2026 NEXUS7101 Digital</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Powered By Footer -->
      <div class="fixed bottom-6 left-0 right-0 flex justify-center z-50">
        <button id="openCredits" class="group flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md border border-white/20 rounded-full shadow-lg hover:bg-white transition-all hover:scale-105 active:scale-95">
          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Powered by</span>
          <span class="text-[10px] font-black text-slate-900 uppercase italic tracking-tighter">NEXUS<span class="text-slate-400">7101</span> Team</span>
        </button>
      </div>
    </div>
  `;
}

export function attachLoginListeners(renderFn) {
  const container = document.getElementById('authContainer');
  const overlayContainer = document.getElementById('overlayContainer');
  const overlay = document.getElementById('overlay');
  const loginPanel = document.getElementById('loginPanel');
  const signupPanel = document.getElementById('signupPanel');
  const overlayLeft = document.getElementById('overlayLeft');
  const overlayRight = document.getElementById('overlayRight');

  const updateUI = () => {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      if (activePanel === 'signup') {
        loginPanel.style.display = 'none';
        signupPanel.style.display = 'block';
      } else {
        loginPanel.style.display = 'block';
        signupPanel.style.display = 'none';
      }
      return;
    }

    // Desktop logic
    loginPanel.style.display = '';
    signupPanel.style.display = '';
    
    if (activePanel === 'signup') {
      loginPanel.style.transform = 'translateX(100%)';
      loginPanel.style.opacity = '0';
      loginPanel.style.pointerEvents = 'none';
      signupPanel.style.transform = 'translateX(100%)';
      signupPanel.style.opacity = '1';
      signupPanel.style.pointerEvents = 'all';
      signupPanel.style.zIndex = '50';
      if (overlayContainer) overlayContainer.style.transform = 'translateX(-100%)';
      if (overlay) overlay.style.transform = 'translateX(50%)';
    } else {
      loginPanel.style.transform = 'translateX(0)';
      loginPanel.style.opacity = '1';
      loginPanel.style.pointerEvents = 'all';
      loginPanel.style.zIndex = '20';
      signupPanel.style.transform = 'translateX(0)';
      signupPanel.style.opacity = '0';
      signupPanel.style.pointerEvents = 'none';
      signupPanel.style.zIndex = '10';
      if (overlayContainer) overlayContainer.style.transform = 'translateX(0)';
      if (overlay) overlay.style.transform = 'translateX(0)';
    }
  };

  window.addEventListener('resize', updateUI);

  const switchToLogin = () => {
    activePanel = 'login'; updateUI();
  };
  const switchToSignup = () => {
    activePanel = 'signup'; updateUI();
  };

  // Mobile tab listeners
  ['mobileToLogin','mobileToLoginBottom'].forEach(id => { const el = document.getElementById(id); if (el) el.onclick = switchToLogin; });
  ['mobileToSignup','mobileToSignupBottom'].forEach(id => { const el = document.getElementById(id); if (el) el.onclick = switchToSignup; });

  const toSignup = document.getElementById('toSignup');
  const toLogin  = document.getElementById('toLogin');
  if (toSignup) toSignup.onclick = switchToSignup;
  if (toLogin)  toLogin.onclick  = switchToLogin;

  updateUI();

  // Google Sign-In Initialization
  const initGoogle = () => {
    if (typeof google === 'undefined') {
      setTimeout(initGoogle, 100);
      return;
    }

    google.accounts.id.initialize({
      client_id: "496700352537-9p20cbvauq9gib2q04sqpn4s0petq575.apps.googleusercontent.com", // USER: Replace with your real Client ID
      callback: handleGoogleLogin
    });

    google.accounts.id.renderButton(
      document.getElementById("googleBtnContainer"),
      { theme: "outline", size: "large", width: "100%", shape: "pill" }
    );
  };

  async function handleGoogleLogin(response) {
    try {
      const res = await auth.googleLogin(response.credential);
      
      state.user = res.data.user;
      state.token = res.data.token;
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      await initData();
      
      if (state.user.role === 'admin') navigate('admin', renderFn);
      else if (state.user.role === 'inspector') navigate('inspector', renderFn);
      else navigate('customer', renderFn);
    } catch (err) {
      alert("Google Login failed: " + (err.response?.data?.error || "Unknown error"));
    }
  }

  // Make it global for the SDK
  window.handleGoogleLogin = handleGoogleLogin;
  initGoogle();

  // Handle Login
  document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('emailLogin').value;
    const password = document.getElementById('passLogin').value;
    
    // Remove old error if exists
    const oldErr = document.getElementById('loginErrorMessage');
    if (oldErr) oldErr.remove();

    try {
      const res = await auth.login(email, password);
      
      // Store EVERYTHING correctly
      state.user = res.data.user;
      state.token = res.data.token;
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      await initData();
      
      if (state.user.role === 'admin') navigate('admin', renderFn);
      else if (state.user.role === 'inspector') navigate('inspector', renderFn);
      else navigate('customer', renderFn);

    } catch (err) {
      const errorMsg = err.response?.data?.error;
      const loginForm = document.getElementById('loginForm');

      let displayMsg = "Invalid email or password.";
      let themeClass = "bg-rose-50 text-rose-500 border-rose-100";

      if (errorMsg === 'PENDING_APPROVAL') {
        displayMsg = "<strong>Verification in Progress.</strong><br>Our team is still reviewing your ID photo. Check your email later!";
        themeClass = "bg-amber-50 text-amber-600 border-amber-100";
      } else if (errorMsg === 'ACCOUNT_REJECTED') {
        displayMsg = "<strong>Account Not Approved.</strong><br>We couldn't verify your identity. Please contact support.";
        themeClass = "bg-slate-900 text-white border-slate-900";
      }

      const errorDiv = document.createElement('div');
      errorDiv.id = 'loginErrorMessage';
      errorDiv.className = `p-4 rounded-2xl border text-xs text-center animate-in fade-in slide-in-from-top-2 duration-300 ${themeClass}`;
      errorDiv.innerHTML = displayMsg;
      
      const title = loginForm.querySelector('h2');
      title.parentNode.insertBefore(errorDiv, title.nextSibling);
    }
  };

  // Handle ID Photo Logic
  const idPreview = document.getElementById('idPreview');
  const idStatusText = document.getElementById('idStatusText');
  const fileInput = document.getElementById('fileInput');
  const uploadBtn = document.getElementById('uploadBtn');
  const openCamera = document.getElementById('openCamera');
  
  const modal = document.getElementById('cameraModal');
  const video = document.getElementById('cameraVideo');
  const canvas = document.getElementById('cameraCanvas');
  let stream = null;

  // File Upload
  if (uploadBtn) {
    uploadBtn.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          idPreview.src = event.target.result;
          idPreview.classList.remove('hidden');
          idStatusText.innerText = "ID UPLOADED √";
          idStatusText.classList.replace('text-slate-400', 'text-emerald-500');
        };
        reader.readAsDataURL(file);
      }
    };
  }

  // Camera
  if (openCamera) {
    openCamera.onclick = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
        video.play();
        modal.classList.remove('hidden');
      } catch (err) { alert("Camera access denied!"); }
    };

    document.getElementById('closeCamera').onclick = () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      modal.classList.add('hidden');
    };

    document.getElementById('capturePhoto').onclick = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      const data = canvas.toDataURL('image/jpeg');
      idPreview.src = data;
      idPreview.classList.remove('hidden');
      idStatusText.innerText = "PHOTO CAPTURED √";
      idStatusText.classList.replace('text-slate-400', 'text-emerald-500');
      if (stream) stream.getTracks().forEach(track => track.stop());
      modal.classList.add('hidden');
    };
  }

  // Handle Signup Submit
  document.getElementById('signupForm').onsubmit = async (e) => {
    e.preventDefault();
    const password = document.getElementById('passSignup').value;
    const confirm = document.getElementById('confirmPass').value;
    if (password !== confirm) { alert("Passwords do not match!"); return; }

    const id_photo = idPreview.classList.contains('hidden') ? null : idPreview.src;
    if (!id_photo) { alert("Please provide an ID photo for verification!"); return; }

    const userData = {
      name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
      email: document.getElementById('emailSignup').value,
      phone: document.getElementById('phoneSignup').value,
      birthday: document.getElementById('birthday').value,
      address: document.getElementById('address').value,
      password,
      id_photo
    };

    try {
      await auth.register(userData);
      
      // Replace form content with a beautiful success message
      const signupForm = document.getElementById('signupForm');
      signupForm.innerHTML = `
        <div class="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-500">
          <div class="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
            <svg class="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-black text-slate-900 mb-2 italic tracking-tight">Request Sent!</h2>
          <p class="text-sm font-medium text-slate-500 mb-8 leading-relaxed px-4">
            Thank you for choosing <span class="font-black text-slate-900 italic">NEXUS7101</span>. 
            Our team is currently verifying your ID. You'll receive an email once your account is ready!
          </p>
          <button type="button" id="backToLoginAfterSuccess" class="btn-primary py-4 px-10">
            Back to Sign In
          </button>
        </div>
      `;

      document.getElementById('backToLoginAfterSuccess').onclick = () => {
        activePanel = 'login';
        updateUI();
      };

    } catch (err) {
      alert(err.response?.data?.error || "Registration failed!");
    }
  };

  // Developer Credits Logic
  const openCredits = document.getElementById('openCredits');
  const closeCredits = document.getElementById('closeCredits');
  const creditsModal = document.getElementById('creditsModal');

  if (openCredits && creditsModal) {
    openCredits.onclick = () => creditsModal.classList.remove('hidden');
  }
  if (closeCredits && creditsModal) {
    closeCredits.onclick = () => creditsModal.classList.add('hidden');
  }
  if (creditsModal) {
    creditsModal.onclick = (e) => {
      if (e.target === creditsModal) creditsModal.classList.add('hidden');
    };
  }
}
