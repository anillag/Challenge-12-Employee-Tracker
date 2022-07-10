const inquirer = require("inquirer");
const db = require("./server/connection");
const cTable = require("console.table");
const { restoreDefaultPrompts } = require("inquirer");

const userChoice = async () => {
    const mainMenu = await inquirer.prompt({
        type: "list",
        message: "What would you like to do? \n",
        name: "chooseAction",
        choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add A Department",
            "Add A Role",
            "Add An Employee",
            "Update An Employee Role",
            "Quit"
        ]
    });
    return mainMenu.chooseAction;
};

const viewAll = (userSelection) => {
    if (userSelection === "View All Departments") {
        var sql = "SELECT * FROM department";
    }
    if (userSelection === "View All Roles") {
        var sql = "SELECT * FROM roles";
    }
    if (userSelection === "View All Employees") {
        var sql = "SELECT * FROM employee";
        console.log("View All Employees fires here");
    }
    // move to switch
    // OR use multiple IFs
    db.query(sql, (err, rows) => {
        if (err) {
            console.error(err);
        } else {
            console.log("\n");
            console.table(rows);
        }
    });
    // const abc = new Promise((resolve,reject) => {
    //     db.query(sql, (err,rows) => {
    //         if (err) {
    //             console.error(err);
    //         } else {
    //             // let rowsOutput = new Promise((resolve, reject) => {
    //             //     resolve(rows)
    //             // })
    //             resolve(rows)
    //         }
    //     })
    // })
    // abc.then(results => {
    //     console.log("\n");
    //     console.table(results);
    //     console.log("results: " + results);
    //     console.log("Rows has displayed");
    //     // console.log("\n" + "Type any key to continue.")
    //     userChoice();
    //     // rowsOutput.then(displayOutput => {
    //     // })
    // })
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
    db.query(sql, params, (err, result) => {
        if (err) {
            console.error(err)
        } else {
            console.log (`${departmentInfo.departmentName} was added to Department`)
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
        },
    ]);
    const sql = `INSERT INTO roles (role_title, role_salary, department_id)
    VALUES (?,?,?)`;
    const params = [
        roleInfo.roleName,
        roleInfo.roleSalary,
        roleInfo.departmentID
    ];
    db.query(sql,params,(err,result) => {
        if (err) {
            console.error(err);
        } else {
            console.log(result);
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
    db.query(sql, params, (err, result) => {
        if (err) {
            console.error(err);
        } else {
            console.log(result);
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
    db.query(sql, params, (err,result) => {
        if (err) {
            console.error(err);
        } else {
            console.log(result);
        }
    });
};

const init = async () => {
    let exit = false;
    while (exit === false) {
        let initialChoice = await userChoice();
        if (initialChoice === "Quit") {
            exit = true;
            return quit();
        } else if (
            initialChoice === "View All Departments" ||
            initialChoice === "View All Roles" ||
            initialChoice === "View All Employees"
            ) {
            viewAll(initialChoice);
        } else if (initialChoice === "Add A Department") {
            let departmentAdded = await addDepartment();
        } else if (initialChoice === "Add A Role") {
            let roleAdded = await addRole();
        } else if (initialChoice === "Add An Employee") {
            let employeeAdded = await addEmployee();
        } else if (initialChoice === "Update An Employee Role") {
            let employeeUpdated = await updateEmployee();
        }
    }
};

const quit = () => {
    process.exit();
};

init();