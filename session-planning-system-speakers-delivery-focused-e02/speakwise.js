// Core UI and Auth Logic

// Check if user is already logged in on page load
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) {
    navigate('dashboard');
  } else {
    navigate('login');
  }
});

function navigate(page) {
  // Hide all sections
  document.getElementById('login-section').classList.add('hidden');
  document.getElementById('dashboard-section').classList.add('hidden');
  
  // Show target section
  document.getElementById(`${page}-section`).classList.remove('hidden');

  // Handle Navbar visibility
  if (page === 'login') {
    document.getElementById('navbar').classList.add('hidden');
  } else {
    document.getElementById('navbar').classList.remove('hidden');
  }
}

async function login() {
  const emailInput = document.getElementById('email').value;
  const passwordInput = document.getElementById('password').value;
  const errorDiv = document.getElementById('login-error');

  errorDiv.classList.add('hidden');

  if (!emailInput || !passwordInput) {
    errorDiv.innerText = "Please enter both email and password.";
    errorDiv.classList.remove('hidden');
    return;
  }

  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput, password: passwordInput })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to login');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    navigate('dashboard');
  } catch (error) {
    errorDiv.innerText = error.message;
    errorDiv.classList.remove('hidden');
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  navigate('login');
}
