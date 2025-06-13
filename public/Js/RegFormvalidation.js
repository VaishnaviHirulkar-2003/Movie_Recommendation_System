// validate.js

function validateForm() {
    alert("hello");
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById(password).value.trim();

    if (username === "") {
        alert("Username is required.");
        return false;
    }

    if (email === "") {
        alert("Email is required.");
        return false;
    }

    if (!isValidEmail(email)) {
        alert("Enter a valid email address.");
        return false;
    }

    if (password === "") {
        alert("Password is required.");
        return false;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return false;
    }

    return true; // allow form submission
}

function isValidEmail(email) {
    // Basic email pattern check
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}
