// =======================================================
// APNI WOHI SUPABASE DETAILS YAHAN DAALEIN
// =======================================================
const SUPABASE_URL = 'https://spxyppywdbgdjithesrd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNweHlwcHl3ZGJnZGppdGhlc3JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwOTcxODYsImV4cCI6MjA3MjY3MzE4Nn0.9fFcEBHhTmiGfp1K_J6RcgadkO1njcIRif_S6_a7KGI'; 
// =======================================================

// *** YEH LINE THEEK KI GAYI HAI ***
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM Elements
const loginView = document.getElementById('login-view');
const signupView = document.getElementById('signup-view');
const dashboardView = document.getElementById('dashboard');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const logoutButton = document.getElementById('logout-button');
const userEmailSpan = document.getElementById('user-email');
const userPointsSpan = document.getElementById('user-points');

// Event Listeners for switching between Login and Signup
showSignup.addEventListener('click', () => {
    loginView.style.display = 'none';
    signupView.style.display = 'block';
});

showLogin.addEventListener('click', () => {
    signupView.style.display = 'none';
    loginView.style.display = 'block';
});

// Signup Function
signupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    const { data, error } = await supabaseClient.auth.signUp({ email, password });

    if (error) {
        alert("Error signing up: " + error.message);
    } else {
        alert("Signup successful! Please che
