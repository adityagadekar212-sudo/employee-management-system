``
`javascript
// ================================
// EMPLOYEE MANAGEMENT SYSTEM
// ================================


// Get HTML elements
const employeeForm = document.getElementById("employeeForm");
const employeeCards = document.getElementById("employeeCards");

const employeeName = document.getElementById("employeeName");
const employeeEmail = document.getElementById("employeeEmail");
const employeePhone = document.getElementById("employeePhone");
const employeeDepartment = document.getElementById("employeeDepartment");
const employeeRole = document.getElementById("employeeRole");
const employeeSalary = document.getElementById("employeeSalary");
const employeeDate = document.getElementById("employeeDate");
const employeeStatus = document.getElementById("employeeStatus");

const searchBox = document.getElementById("searchBox");
const departmentChoice = document.getElementById("departmentChoice");
const statusChoice = document.getElementById("statusChoice");
const sortChoice = document.getElementById("sortChoice");

const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");

const resetFilters = document.getElementById("resetFilters");
const removeAll = document.getElementById("removeAll");


// ================================
// EMPLOYEE DATA
// ================================

let employees = JSON.parse(
    localStorage.getItem("employees")
) || [];

let editId = null;


// ================================
// SAVE DATA
// ================================

function saveData() {
    localStorage.setItem(
        "employees",
        JSON.stringify(employees)
    );
}


// ================================
// ADD / UPDATE EMPLOYEE
// ================================

employeeForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = employeeName.value.trim();
    const email = employeeEmail.value.trim();
    const phone = employeePhone.value.trim();
    const department = employeeDepartment.value;
    const role = employeeRole.value.trim();
    const salary = Number(employeeSalary.value);
    const joiningDate = employeeDate.value;
    const status = employeeStatus.value;


    // Check empty fields
    if (
        name === "" ||
        email === "" ||
        phone === "" ||
        department === "" ||
        role === "" ||
        salary <= 0 ||
        joiningDate === ""
    ) {
        alert("Please fill all details.");
        return;
    }


    // Create employee object
    const employee = {
        name: name,
        email: email,
        phone: phone,
        department: department,
        role: role,
        salary: salary,
        joiningDate: joiningDate,
        status: status
    };


    // UPDATE
    if (editId !== null) {

        for (let i = 0; i < employees.length; i++) {

            if (employees[i].id === editId) {

                employees[i].name = name;
                employees[i].email = email;
                employees[i].phone = phone;
                employees[i].department = department;
                employees[i].role = role;
                employees[i].salary = salary;
                employees[i].joiningDate = joiningDate;
                employees[i].status = status;

                break;
            }
        }

        alert("Employee updated successfully.");

    }

    // ADD
    else {

        employee.id = Date.now();

        employees.push(employee);

        alert("Employee added successfully.");
    }


    saveData();

    clearForm();

    displayEmployees();
});


// ================================
// DISPLAY EMPLOYEES
// ================================

function displayEmployees() {

    employeeCards.innerHTML = "";


    let searchText =
        searchBox.value.toLowerCase().trim();

    let selectedDepartment =
        departmentChoice.value;

    let selectedStatus =
        statusChoice.value;


    let filteredEmployees = [];


    // FILTER
    for (let i = 0; i < employees.length; i++) {

        let employee = employees[i];

        let employeeText =
            employee.name.toLowerCase() +
            " " +
            employee.email.toLowerCase() +
            " " +
            employee.role.toLowerCase();


        let searchMatch =
            employeeText.includes(searchText);


        let departmentMatch =
            selectedDepartment === "all" ||
            employee.department === selectedDepartment;


        let statusMatch =
            selectedStatus === "all" ||
            employee.status === selectedStatus;


        if (
            searchMatch &&
            departmentMatch &&
            statusMatch
        ) {
            filteredEmployees.push(employee);
        }
    }


    // SORT
    if (sortChoice.value === "az") {

        filteredEmployees.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });

    }

    else if (sortChoice.value === "za") {

        filteredEmployees.sort(function(a, b) {
            return b.name.localeCompare(a.name);
        });

    }

    else if (sortChoice.value === "high") {

        filteredEmployees.sort(function(a, b) {
            return b.salary - a.salary;
        });

    }

    else if (sortChoice.value === "low") {

        filteredEmployees.sort(function(a, b) {
            return a.salary - b.salary;
        });
    }


    // NO EMPLOYEE
    if (filteredEmployees.length === 0) {

        employeeCards.innerHTML = ` <
div class = "no-results" >

    <
    h3 > No Employees Found < /h3>

<
p >
    Add an employee or change your filters. <
    /p>

<
/div>
`;

        updateDashboard();

        return;
    }


    // CREATE CARDS
    for (let i = 0; i < filteredEmployees.length; i++) {

        let employee = filteredEmployees[i];

        let statusClass = "";

        if (employee.status === "Active") {
            statusClass = "active";
        } else {
            statusClass = "inactive";
        }


        let card = document.createElement("div");

        card.className = "employee-card";


        card.innerHTML = `

<
div class = "card-top" >

    <
    div >

    <
    h3 >
    $ { employee.name } <
    /h3>

<
span class = "employee-code" >
    Employee ID: EMP - $ { employee.id } <
    /span>

<
/div>


<
span class = "status-pill ${statusClass}" >
    $ { employee.status } <
    /span>

<
/div>


<
p >
    <
    strong > 📧Email: < /strong>
$ { employee.email } <
/p>


<
p >
    <
    strong > 📱Phone: < /strong>
$ { employee.phone } <
/p>


<
p >
    <
    strong > 🏢Department: < /strong>
$ { employee.department } <
/p>


<
p >
    <
    strong > 💼Role: < /strong>
$ { employee.role } <
/p>


<
p >
    <
    strong > 💰Salary: < /strong>₹
$ { employee.salary.toLocaleString("en-IN") } <
/p>


<
p >
    <
    strong > 📅Joining: < /strong>
$ { employee.joiningDate } <
/p>


<
div class = "card-buttons" >

    <
    button
class = "edit-button"
onclick = "editEmployee(${employee.id})" >
    ✏️Edit <
    /button>


<
button
class = "delete-button"
onclick = "deleteEmployee(${employee.id})" >
    🗑️Delete <
    /button>

<
/div>

`;


        employeeCards.appendChild(card);
    }


    updateDashboard();
}


// ================================
// EDIT EMPLOYEE
// ================================

function editEmployee(id) {

    let employee = null;


    for (let i = 0; i < employees.length; i++) {

        if (employees[i].id === id) {

            employee = employees[i];

            break;
        }
    }


    if (employee === null) {
        return;
    }


    employeeName.value = employee.name;
    employeeEmail.value = employee.email;
    employeePhone.value = employee.phone;
    employeeDepartment.value = employee.department;
    employeeRole.value = employee.role;
    employeeSalary.value = employee.salary;
    employeeDate.value = employee.joiningDate;
    employeeStatus.value = employee.status;


    editId = id;


    document.getElementById("formHeading").textContent =
        "Edit Employee";


    saveButton.textContent =
        "✏️ Update Employee";


    cancelButton.classList.remove("hidden");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ================================
// DELETE EMPLOYEE
// ================================

function deleteEmployee(id) {

    let employeeNameToDelete = "";


    for (let i = 0; i < employees.length; i++) {

        if (employees[i].id === id) {

            employeeNameToDelete =
                employees[i].name;

            break;
        }
    }


    let confirmDelete = confirm(
        "Do you want to delete " +
        employeeNameToDelete +
        "?"
    );


    if (!confirmDelete) {
        return;
    }


    let newEmployees = [];


    for (let i = 0; i < employees.length; i++) {

        if (employees[i].id !== id) {

            newEmployees.push(
                employees[i]
            );
        }
    }


    employees = newEmployees;


    saveData();

    displayEmployees();


    alert("Employee deleted successfully.");
}


// ================================
// DELETE ALL
// ================================

removeAll.addEventListener("click", function() {

    if (employees.length === 0) {

        alert("No employees available.");

        return;
    }


    let answer = confirm(
        "Are you sure you want to delete all employees?"
    );


    if (answer) {

        employees = [];

        saveData();

        displayEmployees();

        alert("All employees deleted.");
    }

});


// ================================
// CANCEL EDIT
// ================================

cancelButton.addEventListener("click", function() {

    clearForm();

});


// ================================
// CLEAR FORM
// ================================

function clearForm() {

    employeeForm.reset();

    editId = null;


    document.getElementById("formHeading").textContent =
        "Add New Employee";


    saveButton.textContent =
        "➕ Add Employee";


    cancelButton.classList.add("hidden");
}


// ================================
// SEARCH
// ================================

searchBox.addEventListener(
    "input",
    displayEmployees
);


// ================================
// DEPARTMENT FILTER
// ================================

departmentChoice.addEventListener(
    "change",
    displayEmployees
);


// ================================
// STATUS FILTER
// ================================

statusChoice.addEventListener(
    "change",
    displayEmployees
);


// ================================
// SORT
// ================================

sortChoice.addEventListener(
    "change",
    displayEmployees
);


// ================================
// CLEAR FILTERS
// ================================

resetFilters.addEventListener(
    "click",
    function() {

        searchBox.value = "";

        departmentChoice.value = "all";

        statusChoice.value = "all";

        sortChoice.value = "none";


        displayEmployees();
    }
);


// ================================
// DASHBOARD
// ================================

function updateDashboard() {

    let totalSalary = 0;

    let activeEmployees = 0;


    for (let i = 0; i < employees.length; i++) {

        totalSalary =
            totalSalary +
            employees[i].salary;


        if (
            employees[i].status === "Active"
        ) {

            activeEmployees++;
        }
    }


    let totalEmployees =
        employees.length;


    let averageSalary = 0;


    if (totalEmployees > 0) {

        averageSalary =
            Math.round(
                totalSalary /
                totalEmployees
            );
    }


    document.getElementById(
        "totalEmployees"
    ).textContent =
        totalEmployees;


    document.getElementById(
        "salaryTotal"
    ).textContent =
        "₹" +
        totalSalary.toLocaleString("en-IN");


    document.getElementById(
        "salaryAverage"
    ).textContent =
        "₹" +
        averageSalary.toLocaleString("en-IN");


    document.getElementById(
        "activeTotal"
    ).textContent =
        activeEmployees;
}


// ================================
// FIRST LOAD
// ================================

displayEmployees();
`
``