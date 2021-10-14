// TODO: Include packages needed for this application
const inquirer = require('inquirer');
const fs = require('fs');
const generateMarkdown = require('.//utils/generateMarkdown');

// TODO: Create an array of questions for user input
const questions = [
    {
        type:"input",
        message:"What is the title of your project?",
        name:"projectTitle"
    },
    {
        type:"input",
        message:"Type a descritpion of your project:",
        name:"projectDescription"

    },
    {
        type:"input",
        message:"What is the link to your deployed page?",
        name:"projectURL"
    },
    {
        type:"input",
        message:"Provide the relative path to your screenshot:",
        name:"projectImage"
    },
    {
        type:"input",
        message:"Who should receive credits for this project?",
        name:"projectCreds"
    },
    {
        type:"list",
        message:"Which license type should be used for this project?",
        choices:["MIT", "ISC", "none"],
        name:"projectLicense"
    },
    {
        type:"input",
        message:"What are the features of your project?",
        name:"projectFeatures"
    },
    {
        type:"input",
        message:"How can others contribute to your project?",
        name:"projectContribute"
    },
    {
        type:"input",
        message:"How did you test your project?",
        name:"projectTests"
    }
];

// TODO: Create a function to write README file
function writeToFile(fileName, data) {




    fileContent = generateMarkdown(data);
    
    fs.writeFile(`${fileName}.md`, fileContent, (err) =>
    
    err ? console.error(err) : console.log('Success!')
    
    );


}

// TODO: Create a function to initialize app
async function init() {
    
    let userData = await inquirer.prompt(questions);
    let fileName = userData.projectTitle;

    writeToFile(fileName, userData);

}

// Function call to initialize app
init();
