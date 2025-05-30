document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!username || !password || !confirmPassword) {
    alert("Please fill all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if username exists
  if (users.some(u => u.username === username)) {
    alert("Username already taken. Please choose another.");
    return;
  }

  // Save new user
  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Registration successful! Please login now.");

  // Redirect to login
  window.location.href = "login.html";
});
