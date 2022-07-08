const inquirer = require("inquirer");
const mysql2 = require("mysql2");
const cTable = require("console.table");

const db = mysql2.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "sqlpass",
        database: "employees",
    },
    console.log("Connected to employee database")
);

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

const viewDepartment = () => {
    const sql = "SELECT * FROM departments"
    db.query(sql, (err,rows) => {
        if (err) {
            console.error(err);
        } else {
            console.table("\n" + rows);
        }
    })
}

const init = async () => {
    const exit = false;
    while (exit === false) {
        let initialChoice = await userChoice();
        if (initialChoice === "Quit") {
            exit = true;
            return;
        } else if (initialChoice === "View All Departments") {
            viewDepartment();
        }
    }
};

init();