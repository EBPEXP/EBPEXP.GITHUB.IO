// adminhome.js

import { auth } from '/firebase/firebaseConfig.js';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js';

document.addEventListener('DOMContentLoaded', function() {
    checkAuth(); // Check authentication status on page load

    document.querySelector('#addAdminButton').addEventListener('click', function() {
        addAdmin();
    });

    document.querySelector('#logoutLink').addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
});

function checkAuth() {
    auth.onAuthStateChanged(user => {
        if (!user) {
            // User is not logged in, redirect to login page
            window.location.href = '/admin/login/login.html';
        }
    });
}

function addAdmin() {
    const email = document.querySelector('.email-input').value.trim();
    const errorMessageDiv = document.querySelector('#error-message');
    const addAdminButton = document.querySelector('#addAdminButton');

    // Clear any previous error message
    errorMessageDiv.textContent = '';
    // Show loading text
    errorMessageDiv.textContent = 'Loading...';

    if (!email || !validateEmail(email)) {
        errorMessageDiv.textContent = 'Please enter a valid @experionglobal.com email address.';
        return;
    }

    // Create a new user with a default password
    createUserWithEmailAndPassword(auth, email, 'defaultpassword')
        .then((userCredential) => {
            // User created successfully
            const user = userCredential.user;
            // Send email to user to set password
            sendPasswordReset(email)
                .then(() => {
                    errorMessageDiv.textContent = `Admin privilege added for ${email}. Check your email to set the password.`;
                })
                .catch((error) => {
                    errorMessageDiv.textContent = `Error sending password reset email: ${error.message}`;
                });
        })
        .catch((error) => {
            // Handle specific errors
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessageDiv.textContent = 'Email already in use.';
                    break;
                default:
                    errorMessageDiv.textContent = `Error adding admin: ${error.message}`;
                    break;
            }
        })
        .finally(() => {
            addAdminButton.disabled = false; // Re-enable the button after operation
        });
}

function logout() {
    auth.signOut().then(() => {
        // Sign-out successful.
        window.location.href = '/index.html';
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
}

function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@experionglobal\.com$/;
    return emailPattern.test(email);
}

function sendPasswordReset(email) {
    return sendPasswordResetEmail(auth, email);
}
