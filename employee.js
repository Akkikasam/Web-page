document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("employeeForm");
  const empIdField = document.getElementById("employeeId");
  const loginIdField = document.getElementById("loginId");
  const dobField = document.getElementById("dob");
  const errorMsg = document.getElementById("errorMsg");

  // 1. Auto-generate Employee ID
  const empId = "EMP" + (Math.floor(Math.random() * 90000) + 10000);
  empIdField.value = empId;

  // 2. Auto-generate Login ID when First Name and Last Name are entered
  document.getElementById("firstName").addEventListener("input", generateLoginId);
  document.getElementById("lastName").addEventListener("input", generateLoginId);

  function generateLoginId() {
    const first = document.getElementById("firstName").value.trim();
    const last = document.getElementById("lastName").value.trim();

    if (first && last) {
      let baseId = (first[0] + last).toLowerCase();
      let loginId = baseId;
      let existing = JSON.parse(localStorage.getItem("employees") || "[]");

      // Ensure uniqueness
      let count = 1;
      while (existing.some(e => e.loginId === loginId)) {
        loginId = baseId + Math.floor(Math.random() * 1000);
        count++;
        if (count > 10) break; // avoid infinite loop
      }

      loginIdField.value = loginId;
    }
  }

  // 3. Form Submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorMsg.textContent = "";

    const dob = new Date(dobField.value);
    const age = new Date().getFullYear() - dob.getFullYear();
    if (age < 18) {
      errorMsg.textContent = "Employee must be at least 18 years old.";
      return;
    }

    const file = document.getElementById("idProof").files[0];
    if (!file || file.type !== "application/pdf" || file.size < 10240 || file.size > 1048576) {
      errorMsg.textContent = "Upload a valid PDF between 10KB and 1MB.";
      return;
    }

    // Store data
    const employee = {
      employeeId: empIdField.value,
      firstName: document.getElementById("firstName").value,
      middleName: document.getElementById("middleName").value,
      lastName: document.getElementById("lastName").value,
      loginId: loginIdField.value,
      dob: dobField.value,
      department: document.getElementById("department").value,
      salary: document.getElementById("salary").value,
      permanentAddress: document.getElementById("permanentAddress").value,
      currentAddress: document.getElementById("currentAddress").value,
      idProofName: file.name
    };

    const existing = JSON.parse(localStorage.getItem("employees") || "[]");
    existing.push(employee);
    localStorage.setItem("employees", JSON.stringify(existing));

    alert("Employee added successfully!");
    form.reset();
    empIdField.value = "EMP" + (Math.floor(Math.random() * 90000) + 10000);
    loginIdField.value = "";
  });
});

