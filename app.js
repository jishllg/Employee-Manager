// Importing libraries
const mysql = require("mysql");
const inquirer = require("inquirer");

// Connecting to MySQL database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "employees"
});
connection.connect(function(err) {
    if (err) throw err;
    start();
});

// Starting the program
function start() {
    console.log(`
    ________  _______  __    ______  ______________
   / ____/  |/  / __ \/ /   / __ \ \/ / ____/ ____/
  / __/ / /|_/ / /_/ / /   / / / /\  / __/ / __/   
 / /___/ /  / / ____/ /___/ /_/ / / / /___/ /___   
/_____/_/__/_/_/  _/_____/\____/_/_/_____/_____/   
   /  |/  /   |  / | / /   | / ____/ ____/ __ \    
  / /|_/ / /| | /  |/ / /| |/ / __/ __/ / /_/ /    
 / /  / / ___ |/ /|  / ___ / /_/ / /___/ _, _/     
/_/  /_/_/  |_/_/ |_/_/  |_\____/_____/_/ |_|      
                                                   
`);
    updateChoices();
}

// Displaying the main menu
function menu() {
    inquirer.prompt([{
        type: "list",
        name: "choice",
        message: "Select your action:",
        choices: ["Add Employee", "View Employees", "Update Employee Role", "Add Department", "View Departments", "Add Role", "View Roles", "Exit"]
    }]).then(function(response) {
        switch (response.choice) {
            case "Add Employee":
                add();
                break;
            case "View Employees":
                view();
                break;
            case "Add Department":
                add("department");
                break;
            case "View Departments":
                view("department");
                break;
            case "Add Role":
                view("role");
                break;
            case "View Roles":
                view("role");
                break;
            case "Exit":
                return;
            default:
                console.log("Error: No option chosen.");
                menu();
                break;
        }
    });
}

function add(table) {
    if (table == null) {table = "employee";}
    inquirer.prompt([{
        type: "input",
        name: "first_name",
        message: "Enter the employee's first name:",
        when: function(table) {return table = "employee";}
    },{
        type: "input",
        name: "last_name",
        message: "Enter the employee's last name:",
        when: function(table) {return table = "employee";}
    },{
        type: "list",
        name: "role_id",
        message: "Choose the employee's role:",
        choices: roleList,
        when: function(table) {return table = "employee";}
    },{
        type: "list",
        name: "manager_id",
        message: "Choose the employee's manager:",
        choices: managerList,
        when: function(table) {return table = "employee";}
    },{
        type: "input",
        name: "role",
        message: "Enter the name of the role:",
        when: function(table) {return table = "role";}
    },{
        type: "number",
        name: "salary",
        message: "Enter the salary of the role:",
        when: function(table) {return table = "role";}
    },{
        type: "list",
        name: "department",
        message: "Choose a department for this role:",
        choices: departmentList,
        when: function(table) {return table = "role";}
    },{
        type: "input",
        name: "department",
        message: "Enter the name of the department:",
        when: function(table) {return table = "department";}
    }]).then(function(response) {
        connection.query("INSERT INTO ? SET ?", [table, response]);
        updateChoices();
    });
}

function view(table) {
    if (table == null) {
        connection.query("SELECT * FROM employee").
        then(function(employees) {
            console.table(employees);
            menu();
        });
    }
    else {
        connection.query("SELECT * FROM ?", table).
        then(function(response) {
            console.table(response);
            menu();
        });
    }
}

function updateChoices() {
    connection.query("SELECT department.id, department.name")
    .then(function(departments) {
        departments.forEach(function(department) {department.value = department.id;})
        departmentList = departments;
        connection.query("SELECT role.id, role.name")
        .then(function(roles) {
            roles.forEach(function(role) {role.value = role.id;})
            roleList = roles;
            connection.query("SELECT employee.id, employee.first_name, employee.last_name")
            .then(function(managers) {
                managers.forEach(function(manager) {
                    manager.value = manager.id;
                    manager.name = manager.first_name + " " + manager.last_name;
                });
                managerList = managers;
                menu();
            });
        });
    });
}
let departmentList = [];
let roleList = [];
let managerList = [];