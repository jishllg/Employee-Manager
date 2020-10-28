-- Making sure no previous database exists, creating database, and putting the new database into use --
DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;
USE employees;

-- Creating tables --
CREATE TABLE department (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  name VARCHAR(30) NOT NULL
);
CREATE TABLE role (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  INDEX department_index (department_id),
  CONSTRAINT department FOREIGN KEY (department_id) REFERENCES department(id)
);
CREATE TABLE employee (
  id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  INDEX role_index (role_id),
  CONSTRAINT role FOREIGN KEY (role_id) REFERENCES role(id),
  manager_id INT,
  INDEX manager_index (manager_id),
  CONSTRAINT manager FOREIGN KEY (manager_id) REFERENCES employee(id)
);

-- Creating inital entries (OPTIONAL) --
INSERT INTO department (name) VALUES
    ("Sales"),
    ("Engineering"),
    ("Finance"),
    ("Legal");
INSERT INTO role (title, salary, department_id) VALUES
    ("Salesperson", 80000, 1),
    ("Sales Lead", 100000, 1),
    ("Software Engineer", 120000, 2),
    ("Lead Engineer", 150000, 2),
    ("Accountant", 125000, 2),
    ("Account Manager", 160000, 3),
    ("Lawyer", 190000, 4),
    ("Legal Team Lead", 250000, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ("John", "Doe", 2, null),
    ("Jane", "Smith", 1, 1),
    ("Jim", "Johnson", 4, null),
    ("Jackie", "Jackson", 3, 3),
    ("John", "Denver", 6, null),
    ("Mark", "Baltimore", 5, 5),
    ("Carrie", "Houston", 8, null),
    ("Isabella", "Albany", 7, 7);
