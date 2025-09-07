// =======================================================
// AAPKI DETAILS IS CODE MEIN PEHLE SE DAAL DI GAYI HAIN
// =======================================================
const SUPABASE_URL = 'https://spxyppywdbgdjithesrd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNweHlwcHl3ZGJnZGppdGhlc3JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwOTcxODYsImV4cCI6MjA3MjY3MzE4Nn0.9fFcEBHhTmiGfp1K_J6RcgadkO1njcIRif_S6_a7KGI';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
// =======================================================

// Views
const views = document.querySelectorAll('.view');
const loginView = document.getElementById('login-view');
const signupView = document.getElementById('signup-view');
const dashboardView = document.getElementById('dashboard');
const withdrawView = document.getElementById('withdraw-view');

// Forms and Buttons
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const withdrawForm = document.getElementById('withdraw-form');
document.getElementById('show-signup').addEventListener('click', () => showView('signup-view'));
document.getElementById('show-login').addEventListener('click', () => showView('login-view'));
document.getElementById('logout-button').addEventListener('click', logout);
document.getElementById('task-button').addEventListener('click', performTask);
document.getElementById('show-withdraw-button').addEventListener('click', () => showView('withdraw-view'));
document.getElementById('back-to-dashboard').addEventListener('click', () => showView('dashboard'));

// Display Elements
const userNameDisplay = document.getElementById('user-name-display');
const userPointsDisplay = document.getElementById('user-points-display');
const userReferralCodeDisplay = document.getElementById('user-referral-code');

let currentUser = null;

function showView(viewId) {
    views.forEach(view => view.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

// --- SIGNUP ---
signupForm.addEventListener('submit', async (e) => { e.preventDefault(); const name = document.getElementById('signup-name').value; const email = document.getElementById('signup-email').value; const password = document.getElementById('signup-password').value; const referralCode = document.getElementById('signup-referral').value.trim(); const newReferralCode = name.split(' ')[0].toLowerCase() + Math.random().toString(36).substring(2, 6); const { data, error } = await supabaseClient.from('users').insert([{ name, email, password, points: 0, referral_code: newReferralCode, referred_by: referralCode || null }]).select().single(); if (error) { alert("Error: " + (error.message.includes('unique constraint') ? "Email or Referral Code already exists." : error.message)); } else { alert("Signup successful! Please login."); showView('login-view'); } });

// --- LOGIN ---
loginForm.addEventListener('submit', async (e) => { e.preventDefault(); const email = document.getElementById('login-email').value; const password = document.getElementById('login-password').value; const { data, error } = await supabaseClient.from('users').select('*').eq('email', email).eq('password', password).single(); if (error || !data) { alert("Invalid email or password."); } else { currentUser = data; updateDashboard(); showView('dashboard'); } });

function logout() { currentUser = null; showView('login-view'); }

function updateDashboard() { if (currentUser) { userNameDisplay.textContent = currentUser.name; userPointsDisplay.textContent = currentUser.points; userReferralCodeDisplay.textContent = currentUser.referral_code; } }

// =====================================================
// YEH FUNCTION AAPKE DIYE GAYE CODE KE SATH UPDATE HUA HAI
// =====================================================
async function performTask() {
    const taskButton = document.getElementById('task-button');
    taskButton.disabled = true;
    taskButton.textContent = "Loading Ad...";

    // Check karein ke Monetag ka function mojood hai ya nahi
    if (typeof show_9832522 !== 'function') {
        alert("Ad provider is not available. Please try again later.");
        taskButton.disabled = false;
        taskButton.textContent = "Watch Ad (+10 PKR)";
        return;
    }
    
    // Aapka diya gaya Monetag function call karein
    show_9832522().then(async () => {
        // Yeh code ad dekhne ke BAAD chalega
        const newPoints = currentUser.points + 10;
        const { error } = await supabaseClient.from('users').update({ points: newPoints }).eq('id', currentUser.id);

        if (error) {
            alert("Error updating points.");
        } else {
            currentUser.points = newPoints;
            updateDashboard();
            alert("You earned 10 PKR!");
        }
        
        taskButton.disabled = false;
        taskButton.textContent = "Watch Ad (+10 PKR)";

    }).catch(() => {
        // Agar ad mein koi error aaye ya user usay band kar de
        alert("Ad was not completed. No points earned.");
        taskButton.disabled = false;
        taskButton.textContent = "Watch Ad (+10 PKR)";
    });
}

// --- WITHDRAWAL ---
withdrawForm.addEventListener('submit', async (e) => { e.preventDefault(); const amount = parseInt(document.getElementById('withdraw-amount').value); const method = document.getElementById('withdraw-method').value; const number = document.getElementById('withdraw-number').value; if (amount < 500) return alert("Minimum withdrawal is 500 PKR."); if (amount > currentUser.points) return alert("You don't have enough balance."); if (!method || !number) return alert("Please fill all fields."); const withdrawButton = withdrawForm.querySelector('button'); withdrawButton.disabled = true; const { error: reqError } = await supabaseClient.from('withdrawals').insert([{ user_id: currentUser.id, amount, method, account_number: number, status: 'pending' }]); if (reqError) { alert("Error submitting request: " + reqError.message); withdrawButton.disabled = false; return; } const newPoints = currentUser.points - amount; const { error: userError } = await supabaseClient.from('users').update({ points: newPoints }).eq('id', currentUser.id); if (userError) { alert("Error updating your balance. Please contact support."); withdrawButton.disabled = false; return; } currentUser.points = newPoints; if (currentUser.referred_by) { const { data: referrer } = await supabaseClient.from('users').select('id, points').eq('referral_code', currentUser.referred_by).single(); if (referrer) { await supabaseClient.from('users').update({ points: referrer.points + 20 }).eq('id', referrer.id); } } alert(`Withdrawal request for
