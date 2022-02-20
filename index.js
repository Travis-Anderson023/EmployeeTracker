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
const viewDepartments = async () => {
    db.query("SELECT * FROM department", function (err, result) {
        if (err) throw err;
        console.log('');
        console.table(result);
    });
}

const viewRoles = async () => {
    //presented with the job title, role id, the department that role belongs to, and the salary for that role
    db.query("SELECT employee_role.title, employee_role.id, department.name, employee_role.salary FROM employee_role INNER JOIN department ON employee_role.department_id = department.id INNER JOIN employee ON employee_role.id = employee.role_id", function (err, result) {
        if (err) throw err;
        console.log('');
        console.table(result);
    });
}

const viewEmployees = async () => {
    //presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, employee_role.title, department.name, employee_role.salary, CONCAT(m.first_name, ' ', m.last_name) 'manager_title' FROM employee INNER JOIN employee_role ON employee.role_id = employee_role.id INNER JOIN department ON employee_role.department_id = department.id LEFT JOIN employee m ON (employee.manager_id = m.id)`, function (err, result) {
        if (err) throw err;
        console.log('');
        console.table(result);
    });
}

const addDepartment = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'Enter Department Name',
        }
    ])
    db.query(`INSERT INTO department (name) VALUES ('${answers.department}')`, function (err, result) {
        if (err) throw err;
        console.log('');
        console.log(`${answers.department} added`);
    });
}

const addRole = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'Enter Role Name',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter Salary',
        },
        {
            type: 'number',
            name: 'department_id',
            message: 'Enter Department ID',
        },
    ])
    db.query(`INSERT INTO employee_role (title, salary, department_id) VALUES ('${answers.role}', '${answers.salary}', '${answers.department_id}')`, function (err, result) {
        if (err) throw err;
        console.log(`${answers.role} added`);
    });
}

const addEmployee = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter First Name',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter Last Name',
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'Enter Role ID',
        },
        {
            type: 'input',
            name: 'manager_id',
            message: 'Enter Manager ID',
        },
    ])
    //checks if answers.manager_id exists in employee table
    let roleId = parseInt(answers.role_id);
    let managerId = null;
    db.query(`SELECT * FROM employee WHERE id = ${answers.manager_id}`, function (err, result) {
        if (err) throw err;
        if (result.length === 0) {
            managerId = null;
        } else {
            managerId = null;
        }
    });

    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.first_name}', '${answers.last_name}', ${roleId}, ${managerId})`, function (err, result) {
        if (err) throw err;
        console.log(`${answers.first_name} ${answers.last_name} added`);
    });

}

const updateRole = async () => {
    console.log('Update Employee Role');
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'employee_id',
            message: 'Enter Employee ID',
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'Enter Role ID',
        },
    ])
    db.query(`UPDATE employee SET role_id = '${answers.role_id}' WHERE id = '${answers.employee_id}'`, function (err, result) {
        if (err) throw err;
        console.log(`${answers.employee_id} updated`);
    });
}

const menu = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'Main Menu',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role'],
        }
    ])

    switch (answers.menu) {
        case 'View All Departments':
            await viewDepartments();
            break;
        case 'View All Roles':
            await viewRoles();
            break;
        case 'View All Employees':
            await viewEmployees();
            break;
        case 'Add Department':
            await addDepartment();
            break;
        case 'Add Role':
            await addRole();
            break;
        case 'Add Employee':
            await addEmployee();
            break;
        case 'Update Employee Role':
            await updateRole();
            break;
    }
    await menu();
}

menu();
