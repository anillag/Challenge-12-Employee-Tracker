const inquirer = require("inquirer");
const db = require("./server/connection");
const cTable = require("console.table");

// "Main" menu
const userSelection = async () => {
    const userMenu = await inquirer.prompt({
        type: "list",
        name: "chooseAction",
        message: "What would you like to do?",
        choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "View Employees For Manager ID",
            "Add A Department",
            "Add A Role",
            "Add An Employee",
            "Update An Employee Role",
            "Update An Employees Manager",
            "Quit"
        ]
    });
    return userMenu.chooseAction;
};

// Handles the "View All" options
const viewAllChoices = (userChoice) => {
    switch (userChoice) {
        case "View All Departments":
            var sql = "SELECT * FROM department";
            break;
        case "View All Roles":
            var sql = "SELECT * FROM roles";
            break;
        case "View All Employees":
            var sql = "SELECT * FROM employee";
            break;
    }
    // if (userChoice === "View All Departments") {
    //     var sql = "SELECT * FROM department";
    // }
    // if (userChoice === "View All Roles") {
    //     var sql = "SELECT * FROM roles";
    // }
    // if (userChoice === "View All Employees") {
    //     var sql = "SELECT * FROM employee";
    // }
    // move to switch
    db.query(sql, (err, tableOutput) => {
        if (err) {
            console.error(err);
        } else {
            console.table(tableOutput);
            console.log("Press UP ARROW or DOWN ARROW to continue.")
        }
    });
}

const viewEmployeesByManager = async () => {
    const employeeInfo = await inquirer.prompt({
        type: "number",
        name: "byManagerID",
        message: "What is the ID of the manager?"
    });
    const sql = `SELECT * FROM employee WHERE manager_id=?`
    const params = [employeeInfo.byManagerID];
    db.query(sql, params, (err, tableOutput) => {
        if (err) {
            console.error(err);
        } else {
            console.table(tableOutput);
            console.log("Press UP ARROW or DOWN ARROW to continue.")
        }
    });
}

const addDepartment = async () => {
    const departmentInfo = await inquirer.prompt({
        type: "input",
        name: "departmentName",
        message: "What is the name of this department?"
    });
    const sql = `INSERT INTO department (department_name)
    VALUES (?)`;
    const params = [departmentInfo.departmentName]
    db.query(sql, params, (err) => {
        if (err) {
            console.error(err)
        } else {
            console.log(`${departmentInfo.departmentName} was added to the department table`)
        }
    })
}

const addRole = async () => {
    const roleInfo = await inquirer.prompt([
        {
            type: "input",
            name: "roleName",
            message: "What is the name of this role?"
        },
        {
            type: "number",
            name: "roleSalary",
            message: "What is the salary for this role?"
        },
        {
            type: "number",
            name: "departmentID",
            // could be updated
            message: "What is the ID for the department this role is listed under?"
        }
    ]);
    const sql = `INSERT INTO roles (role_title, role_salary, department_id)
    VALUES (?,?,?)`;
    const params = [
        roleInfo.roleName,
        roleInfo.roleSalary,
        roleInfo.departmentID
    ];
    db.query(sql, params, (err, tableOutput) => {
        if (err) {
            console.error(err);
        } else {
            console.table(tableOutput);
            console.log("Press UP ARROW or DOWN ARROW to continue.")
        }
    });
};

const addEmployee = async () => {
    const employeeInfo = await inquirer.prompt([
        {
            type: "input",
            name: "employeeFirstName",
            message: "What is their first name?"
        },
        {
            type: "input",
            name: "employeeLastName",
            message: "What is their last name?"
        },
        {
            type: "number",
            name: "employeeRoleID",
            message: "What is the ID for their role?"
        },
        {
            type: "number",
            name: "employeeManagerID",
            message: "What is the employee ID of their manager?"
        }
    ]);
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?,?,?,?)`
    const params = [
        employeeInfo.employeeFirstName,
        employeeInfo.employeeLastName,
        employeeInfo.employeeRoleID,
        employeeInfo.employeeManagerID
    ];
    db.query(sql, params, (err, tableOutput) => {
        if (err) {
            console.error(err);
        } else {
            console.table(tableOutput);
            console.log("Press UP ARROW or DOWN ARROW to continue.")
        }
    });
};

const updateEmployee = async () => {
    const employeeUpdated = await inquirer.prompt([
        {
            type: "number",
            name: "employeeID",
            message: "What is their employee ID?"
        },
        {
            type: "number",
            name: "newRoleID",
            message: "What is the ID of their new role?"
        }
    ]);
    const sql = `UPDATE employee SET role_id=? WHERE id=?`
    const params = [
        employeeUpdated.newRoleID,
        employeeUpdated.employeeID
    ];
    db.query(sql, params, (err, tableOutput) => {
        if (err) {
            console.error(err);
        } else {
            console.log(tableOutput);
            console.log("Press UP ARROW or DOWN ARROW to continue.")
        }
    });
};

const updateEmployeeManager = async () => {
    const employeeManagerUpdated = await inquirer.prompt([
        {
            type: "number",
            name: "employeeIDToUpdate",
            message: "What is the employee ID that you wish to update?"
        },
        {
            type: "number",
            name: "newEmployeeManagerID",
            message: "What is the ID of their new manager?"
        }
    ]);
    const sql = `UPDATE employee SET manager_id=? WHERE id=?`
    const params = [
        employeeManagerUpdated.newEmployeeManagerID,
        employeeManagerUpdated.employeeIDToUpdate
    ];
    db.query(sql, params, (err, tableOutput) => {
        if (err) {
            console.error(err);
        } else {
            console.table(tableOutput);
            console.log("Press UP ARROW or DOWN ARROW to continue.")
        }
    });
};

const start = async () => {
    let exit = false;
    while (exit === false) {
        let initialChoice = await userSelection();
        if (initialChoice === "Quit") {
            exit = true;
            return quit();
        } else if (
            initialChoice === "View All Departments" ||
            initialChoice === "View All Roles" ||
            initialChoice === "View All Employees"
            ) {
            viewAllChoices(initialChoice);
        } else if (initialChoice === "View Employees For Manager ID") {
            let employeesByManager = await viewEmployeesByManager();
        } else if (initialChoice === "Add A Department") {
            let departmentAdded = await addDepartment();
        } else if (initialChoice === "Add A Role") {
            let roleAdded = await addRole();
        } else if (initialChoice === "Add An Employee") {
            let employeeAdded = await addEmployee();
        } else if (initialChoice === "Update An Employee Role") {
            let employeeUpdated = await updateEmployee();
        } else if (initialChoice === "Update An Employees Manager") {
            let employeeManagerUpdated = await updateEmployeeManager();
        }
    }
};

const quit = () => {
    process.exit();
};

start();