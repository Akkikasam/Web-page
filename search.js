let employees = JSON.parse(localStorage.getItem("employees")) || [];
let filteredEmployees = employees;
let currentPage = 1;
const recordsPerPage = 5;

// Load employees from localStorage
function loadEmployees() {
  return JSON.parse(localStorage.getItem("employees")) || [];
}

// Filter employees based on inputs
function filterEmployees() {
  const id = document.getElementById("filterEmployeeId").value.trim().toLowerCase();
  const fname = document.getElementById("filterFirstName").value.trim().toLowerCase();
  const lname = document.getElementById("filterLastName").value.trim().toLowerCase();
  const loginId = document.getElementById("filterLoginId").value.trim().toLowerCase();
  const dobFrom = document.getElementById("filterDOBFrom").value;
  const dobTo = document.getElementById("filterDOBTo").value;
  const dept = document.getElementById("filterDepartment").value;

  return loadEmployees().filter(emp => {
    return (!id || emp.employeeId.toLowerCase().includes(id)) &&
      (!fname || emp.firstName.toLowerCase().includes(fname)) &&
      (!lname || emp.lastName.toLowerCase().includes(lname)) &&
      (!loginId || emp.loginId.toLowerCase().includes(loginId)) &&
      (!dept || emp.department === dept) &&
      (!dobFrom || new Date(emp.dob) >= new Date(dobFrom)) &&
      (!dobTo || new Date(emp.dob) <= new Date(dobTo));
  });
}

// Apply filters and render the table
function applyFilters() {
  filteredEmployees = filterEmployees();
  currentPage = 1;
  renderTable(currentPage);
}

// Render the table with pagination
function renderTable(page) {
  const tableBody = document.querySelector("#employeeTable tbody");
  tableBody.innerHTML = "";

  const start = (page - 1) * recordsPerPage;
  const end = start + recordsPerPage;
  const pageRecords = filteredEmployees.slice(start, end);

  pageRecords.forEach(emp => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><input type="checkbox" class="select-row" data-id="${emp.employeeId}"></td>
      <td><a href="#" onclick="viewEmployee('${emp.employeeId}')">${emp.employeeId}</a></td>
      <td>${emp.firstName}</td>
      <td>${emp.lastName}</td>
      <td>${emp.loginId}</td>
      <td>${emp.dob}</td>
      <td>${emp.department}</td>
      <td>${emp.salary}</td>
      <td>
        <button onclick="viewEmployee('${emp.employeeId}')">View</button>
        <button onclick="editEmployee('${emp.employeeId}')">Edit</button>
        <button onclick="deleteEmployee('${emp.employeeId}')">Delete</button>
        <button onclick="showHistory('${emp.employeeId}')">History</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  renderPagination(page);
}

// Render pagination buttons
function renderPagination(current) {
  const totalPages = Math.ceil(filteredEmployees.length / recordsPerPage);
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.disabled = i === current;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderTable(i);
    });
    pagination.appendChild(btn);
  }
}

// Delete selected employees
function deleteSelected() {
  const selected = document.querySelectorAll(".select-row:checked");
  if (selected.length === 0) return alert("No employees selected.");
  if (!confirm("Are you sure you want to delete selected employees?")) return;

  const idsToDelete = Array.from(selected).map(input => input.dataset.id);
  let employees = loadEmployees();
  employees = employees.filter(emp => !idsToDelete.includes(emp.employeeId));
  localStorage.setItem("employees", JSON.stringify(employees));
  filteredEmployees = filterEmployees();
  renderTable(currentPage);
}

// View employee details
function viewEmployee(empId) {
  const employees = loadEmployees();
  const emp = employees.find(e => e.employeeId === empId);
  if (!emp) return alert("Employee not found.");

  let details = `Employee Details:\n\n`;
  for (const key in emp) {
    if (Object.hasOwnProperty.call(emp, key) && key !== 'idProof' && key !== 'history') {
      details += `${key}: ${emp[key]}\n`;
    }
  }
  alert(details);
}

// Edit employee: open modal and populate fields
function editEmployee(empId) {
  const employees = loadEmployees();
  const emp = employees.find(e => e.employeeId === empId);
  if (!emp) return alert("Employee not found.");

  document.getElementById("editEmpId").value = emp.employeeId;
  document.getElementById("editFirstName").value = emp.firstName;
  document.getElementById("editLastName").value = emp.lastName;
  document.getElementById("editModal").style.display = "block";
}

// Close the edit modal
function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

// Handle edit form submission
document.getElementById("editForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const empId = document.getElementById("editEmpId").value;
  const newFirstName = document.getElementById("editFirstName").value.trim();
  const newLastName = document.getElementById("editLastName").value.trim();
  const newFile = document.getElementById("editIdProof").files[0];

  const employees = loadEmployees();
  const empIndex = employees.findIndex(e => e.employeeId === empId);
  if (empIndex === -1) return alert("Employee not found.");

  employees[empIndex].firstName = newFirstName;
  employees[empIndex].lastName = newLastName;

  if (!employees[empIndex].history) {
    employees[empIndex].history = [];
  }

  if (newFile) {
    if (newFile.type !== "application/pdf") {
      return alert("Only PDF files are allowed.");
    }
    if (newFile.size < 10 * 1024 || newFile.size > 1024 * 1024) {
      return alert("PDF size must be between 10KB and 1MB.");
    }

    const reader = new FileReader();
    reader.onload = function () {
      employees[empIndex].idProof = reader.result;
      employees[empIndex].history.push({
        action: "Document Uploaded",
        timestamp: new Date().toLocaleString()
      });

      localStorage.setItem("employees", JSON.stringify(employees));
      closeEditModal();
      alert("Employee updated successfully.");
      filteredEmployees = filterEmployees();
      renderTable(currentPage);
    };
    reader.readAsDataURL(newFile);
  } else {
    localStorage.setItem("employees", JSON.stringify(employees));
    closeEditModal();
    alert("Employee updated successfully.");
    filteredEmployees = filterEmployees();
    renderTable(currentPage);
  }
});

// Delete a single employee by ID
function deleteEmployee(empId) {
  if (!confirm(`Are you sure you want to delete employee ${empId}?`)) return;
  let employees = loadEmployees();
  employees = employees.filter(emp => emp.employeeId !== empId);
  localStorage.setItem("employees", JSON.stringify(employees));
  alert(`Employee ${empId} deleted.`);
  filteredEmployees = filterEmployees();
  renderTable(currentPage);
}

// Show upload history for an employee
function showHistory(empId) {
  const employees = loadEmployees();
  const emp = employees.find(e => e.employeeId === empId);
  if (!emp) return alert("Employee not found.");

  if (!emp.history || emp.history.length === 0) {
    alert(`No history found for employee ${empId}.`);
    return;
  }

  let historyText = `Upload History for ${empId}:\n\n`;
  emp.history.forEach((h, i) => {
    historyText += `${i + 1}. ${h.action} on ${h.timestamp}\n`;
  });

  alert(historyText);
}

// Initial load
filteredEmployees = filterEmployees();
renderTable(currentPage);
