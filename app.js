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
connection.connect(function() {
    console.log("Connected as ID: " + connection.threadId)
    start();
});

// Starting the program
function start() {
    console.log(`
    ________  _______  __    ______  ______________
   / ____/  |/  / __ \\/ /   / __ \\ \\/ / ____/ ____/
  / __/ / /|_/ / /_/ / /   / / / /\\  / __/ / __/   
 / /___/ /  / / ____/ /___/ /_/ / / / /___/ /___   
/_____/_/__/_/_/  _/_____/\\____/_/_/_____/_____/   
   /  |/  /   |  / | / /   | / ____/ ____/ __ \\    
  / /|_/ / /| | /  |/ / /| |/ / __/ __/ / /_/ /    
 / /  / / ___ |/ /|  / ___ / /_/ / /___/ _, _/     
/_/  /_/_/  |_/_/ |_/_/  |_\\____/_____/_/ |_|      
                                                   
`);
    updateChoices();
}

// Displaying the main menu
function menu() {
    inquirer.prompt([{
        type: "list",
        name: "choice",
        message: "Select your action:",
        choices: ["Add Employee", "View Employees", "Add Department", "View Departments", "Add Role", "View Roles", "Exit"]
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
                process.exit();
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
        when: function(table) {return table === "employee";}
    },{
        type: "input",
        name: "last_name",
        message: "Enter the employee's last name:",
        when: function(table) {return table === "employee";}
    },{
        type: "list",
        name: "role_id",
        message: "Choose the employee's role:",
        choices: roleList,
        when: function(table) {return table === "employee";}
    },{
        type: "list",
        name: "manager_id",
        message: "Choose the employee's manager:",
        choices: managerList,
        when: function(table) {return table === "employee";}
    },{
        type: "input",
        name: "title",
        message: "Enter the name of the role:",
        when: function(table) {return table === "role";}
    },{
        type: "number",
        name: "salary",
        message: "Enter the salary of the role:",
        when: function(table) {return table === "role";}
    },{
        type: "list",
        name: "department_id",
        message: "Choose a department for this role:",
        choices: departmentList,
        when: function(table) {return table === "role";}
    },{
        type: "input",
        name: "name",
        message: "Enter the name of the department:",
        when: table === "department"
    }]).then(function(response) {
        let query = "INSERT INTO " + table + " SET ?;";
        connection.query(query, response, function(err) {
            if (err) throw err;
            updateChoices();
        });
    });
}

function view(table) {
    if (table === "role") {
        connection.query("SELECT * FROM role;", function(err, response) {
            if (err) throw err;
            console.table(response);
            menu();
        });
    }

    else if (table === "department") {
        connection.query("SELECT name FROM department;", function(err, response) {
            if (err) throw err;
            console.table(response);
            menu();
        });
    }
    else {
        connection.query("SELECT * FROM employee;", function(err, response) {
            if (err) throw err;
            console.table(response);
            menu();
        });
    }
}

function updateChoices() {
    connection.query("SELECT * FROM department;", function(err, departments) {
        if (err) throw err;
        departments.forEach(function(department) {department.value = department.id;});
        departmentList = departments;
        connection.query("SELECT * FROM role;", function(err, roles) {
            if (err) throw err;
            roles.forEach(function(role) {role.value = role.id;});
            roleList = roles;
            connection.query("SELECT id, first_name, last_name FROM employee;", function(err, managers) {
                if (err) throw err;
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