// ===== SESSION MANAGEMENT (works on all pages) =====
function getCurrentUser() {
    const userData = localStorage.getItem('ikigaiCurrentUser');
    return userData ? JSON.parse(userData) : null;
}

function setCurrentUser(user) {
    localStorage.setItem('ikigaiCurrentUser', JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem('ikigaiCurrentUser');
}

function updateHeaderUI() {
    const user = getCurrentUser();
    const authButtons = document.getElementById('authButtons');
    if (!authButtons) return;

    if (user) {
        authButtons.innerHTML = `
            <span class="user-chip">${user.name}</span>
            <button class="logout-btn auth-link" id="logoutBtn">Logout</button>
        `;
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                clearCurrentUser();
                window.location.href = 'index.html';
            });
        }
    } else {
        authButtons.innerHTML = '<a href="login.html" class="login-button" aria-label="Login">LOGIN</a>';
    }
}

// ===== LOGIN PAGE SPECIFIC (only runs when login form exists) =====
var authForm = document.getElementById('authForm');
var isRegisterMode = false;

function showMessage(text) {
    var messageBox = document.getElementById('messageBox');
    if (messageBox) messageBox.textContent = text;
}

function setMode(registerMode) {
    var nameField = document.getElementById('nameField');
    var nameInput = document.getElementById('name');
    var authTitle = document.getElementById('authTitle');
    var authSubtitle = document.getElementById('authSubtitle');
    var submitBtn = document.getElementById('submitBtn');
    var switchText = document.getElementById('switchText');
    var toggleModeBtn = document.getElementById('toggleModeBtn');

    // Only run on login page (elements exist)
    if (!authTitle) return;

    isRegisterMode = registerMode;
    if (nameField) nameField.hidden = !registerMode;
    if (nameInput) nameInput.required = registerMode;
    authTitle.textContent = registerMode ? 'Create your account' : 'Welcome back';
    authSubtitle.textContent = registerMode ? 'Register to start shopping.' : 'Log in to continue shopping.';
    submitBtn.textContent = registerMode ? 'Create account' : 'Log in';
    switchText.textContent = registerMode ? 'Already have an account?' : 'New here?';
    toggleModeBtn.textContent = registerMode ? 'Log in instead' : 'Create an account';
    showMessage('');
}

if (authForm) {
    var toggleModeBtn = document.getElementById('toggleModeBtn');
    var submitBtn = document.getElementById('submitBtn');

    toggleModeBtn.addEventListener('click', function() {
        setMode(!isRegisterMode);
    });

    authForm.addEventListener('submit', function(event) {
        event.preventDefault();

        var email = document.getElementById('email').value.trim().toLowerCase();
        var password = document.getElementById('password').value;
        var users = JSON.parse(localStorage.getItem('ikigaiUsers') || '[]');

        if (isRegisterMode) {
            var fullName = document.getElementById('name').value.trim();

            if (!fullName || !email || !password) {
                showMessage('Please fill in all fields.');
                return;
            }

            var existingUser = users.find(function(user) {
                return user.email === email;
            });
            if (existingUser) {
                showMessage('An account with this email already exists.');
                return;
            }

            users.push({ name: fullName, email: email, password: password });
            localStorage.setItem('ikigaiUsers', JSON.stringify(users));
            setCurrentUser({ name: fullName, email: email });
            showMessage('Account created successfully. Redirecting...');
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 800);
            return;
        }

        var matchedUser = users.find(function(user) {
            return user.email === email && user.password === password;
        });
        if (!matchedUser) {
            showMessage('Email or password is incorrect.');
            return;
        }

        setCurrentUser({ name: matchedUser.name, email: matchedUser.email });
        showMessage('Login successful. Redirecting...');
        setTimeout(function() {
            window.location.href = 'index.html';
        }, 800);
    });
}

// ===== INITIALIZE (runs on all pages) =====
document.addEventListener('DOMContentLoaded', function() {
    updateHeaderUI();

    // If on login page and already logged in, redirect to index
    if (authForm) {
        var currentUser = getCurrentUser();
        if (currentUser) {
            window.location.href = 'index.html';
            return;
        }
        var params = new URLSearchParams(window.location.search);
        setMode(params.get('mode') === 'register');
    }
});