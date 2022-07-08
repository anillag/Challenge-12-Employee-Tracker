DROP TABLES IF EXISTS employees;
DROP TABLES IF EXISTS roles;
DROP TABLES IF EXISTS department;

CREATE TABLE department (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    role_title VARCHAR(30) NOT NULL,
    role_salary DECIMAL(10,0),
    department_id INTEGER,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

CREATE TABLE employees (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles(id)
    ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES employees(id)
    ON DELETE SET NULL
);