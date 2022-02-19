const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    },
    console.log('Connected to database')
);

// db.query("DROP DATABASE IF EXISTS employee_db;", function (err, result) {
//     if (err) throw err;
//     console.log("Database created");
// });
const viewDepartments = () => {
}

const viewRoles = () => {
}

const viewEmployees = () => {
}

const addDepartment = () => {
}

const addRole = () => {
}

const addEmployee = () => {
}

const UpdateRole = () => {
}

const menu = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'menu',
                message: 'Main Menu',
                choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Exit'],
            }
        ])
        .then(function (answer) {
            switch (answer.menu) {
                case 'View All Departments':
                    viewDepartments();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update EmployeeRole':
                    UpdateRole();
                    break;
                case 'Exit':
                    console.log('Goodbye');
                    break;
            }
        });
}


