const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employee = [];

async function employeeQuestions() {
    const questions = [
        {
            type: "input",
            name: "name",
            message: "Employee's name:"
        },
        {
            type: "input",
            name: "id",
            message: "Employee's ID #:"
        },
        {
            type: "input",
            name: "email",
            message: "Employee's email:"
        },
        {
            type: "list",
            name: "role",
            message: "Employee's role:",
            choices: [
                "manager",
                "engineer",
                "intern"
            ]
        }
    ];

    return await inquirer.prompt(questions);
};

async function createManager({ name, id, email }) {
    const question = [
        {
            type: "input",
            name: "officeNumber",
            message: "Manager's office number:"
        }
    ];

    const { officeNumber } = await inquirer.prompt(question);
    const manager = new Manager(name, id, email, officeNumber);
    return manager;
};

async function createEngineer({ name, id, email }) {
    const question =[
        {
            type: "input",
            name: "github",
            message: "Engineer's GitHub username:"
        }
    ];

    const { github } = await inquirer.prompt(question);
    const engineer = new Engineer(name, id, email, github);
    return engineer;
};

async function createIntern ({ name, id, email}) {
    const question = [
        {
            type: "input",
            name: "school",
            message: "Intern's school they are currently attending:"
        }
    ];

    const { school } = await inquirer.prompt(question);
    const intern = new Intern(name, id, email, school);
    return intern;
};

async function init() {
    console.log("Answer these questions to add employees to the tracker.");

    let addEmployees = {
        addmore: "yes"
    };

    while (addEmployees.addmore === "yes") {
        try {
            const response = await employeeQuestions();

            switch (response.role) {
                case "manager":
                    employee.push(await createManager({...response}));
                    break;
                case "engineer":
                    employee.push(await createEngineer({...response}));
                    break;
                case "intern":
                    employee.push(await createIntern({...response}));
                    break;
                default:
                    console.error("An error has occured")
            }

            addEmployees = await inquirer.prompt({
                type: "list",
                name: "addmore",
                message: "Do you want to add any more employees?",
                choices: ["yes", "no"]
            });
        } catch (err) {
            console.error(err);
        }
    }
    renderHTML(employee);
}

function renderHTML() {
    const renders = render(employee);

    if(!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdir(OUTPUT_DIR);
    }

    fs.writeFile(outputPath, renders, function(err) {
        if (err) return console.error(err)
    });
}

init();