if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

function showTab(tab) {
  const isLogin = tab === "login";
  loginForm.hidden = !isLogin;
  signupForm.hidden = isLogin;
  tabLogin.classList.toggle("active", isLogin);
  tabSignup.classList.toggle("active", !isLogin);
}

tabLogin.addEventListener("click", function () {
  showTab("login");
});
tabSignup.addEventListener("click", function () {
  showTab("signup");
});

function setError(id, message) {
  document.getElementById(id + "-error").textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(function (el) {
    el.textContent = "";
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  clearErrors();

  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const password = document.getElementById("login-password").value;
  let isValid = true;

  if (!isValidEmail(email)) {
    setError("login-email", "Enter a valid email address.");
    isValid = false;
  }

  if (password.length < 6) {
    setError("login-password", "Password must be at least 6 characters.");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  const user = getUsers().find(function (u) {
    return u.email === email;
  });

  if (!user) {
    setError("login-email", "No account found with that email. Please sign up first.");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
  window.location.href = "index.html";
});

signupForm.addEventListener("submit", function (event) {
  event.preventDefault();
  clearErrors();

  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim().toLowerCase();
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm").value;
  let isValid = true;

  if (name.length < 3) {
    setError("signup-name", "Please enter your full name (at least 3 letters).");
    isValid = false;
  }

  if (!isValidEmail(email)) {
    setError("signup-email", "Enter a valid email address.");
    isValid = false;
  }

  if (password.length < 6) {
    setError("signup-password", "Password must be at least 6 characters.");
    isValid = false;
  }

  if (confirm !== password) {
    setError("signup-confirm", "Passwords do not match.");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  const users = getUsers();
  const exists = users.some(function (u) {
    return u.email === email;
  });

  if (exists) {
    setError("signup-email", "An account with this email already exists. Try logging in.");
    return;
  }

  const newUser = { name: name, email: email };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(newUser));
  window.location.href = "index.html";
});