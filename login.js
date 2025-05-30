document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  // Hardcoded admin credentials
  const adminUser = { username: "admin", password: "admin" };

  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (username === adminUser.username && password === adminUser.password) {
    alert("Admin login successful!");
    sessionStorage.setItem("loggedInUser", JSON.stringify(adminUser));
    window.location.href = "employee.html"; // or admin dashboard
    return;
  }

  // Check if username/password matches any registered user
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    alert("Login successful!");
    sessionStorage.setItem("loggedInUser", JSON.stringify(user));
    window.location.href = "employee.html"; // redirect to employee search page
  } else {
    alert("Invalid username or password.");
  }
});



