// TODO: Create a function that returns a license badge based on which license is passed in
// If there is no license, return an empty string
function renderLicenseBadge(license) {

  if(license == "none"){
    return "";
  }
  else if(license == "MIT"){
    return `![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)`
  }
  else{
    return `![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)`;
  }

}

// TODO: Create a function that returns the license link
// If there is no license, return an empty string
function renderLicenseLink(license) {
  
  if(license == "none"){
    return ``;
  }
  else if(license == "MIT"){
    return `https://choosealicense.com/licenses/mit/`;
  }
  else{
    return `https://choosealicense.com/licenses/isc/#`;
  }
}

// TODO: Create a function that returns the license section of README
// If there is no license, return an empty string
function renderLicenseSection(license) {

  let licenseBadge = renderLicenseBadge(license);
  let licenseLink = renderLicenseLink(license);

  if(license == "none"){
    return ``;
  }
  else if(license == "MIT"){
    return `## License\n
MIT License\n
${licenseBadge}\n
[Click here for more information about this license](${licenseLink})\n

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
\n`;
  }
  else{
    return `## License\n
ISC License\n
${licenseBadge}\n
[Click here for more information about this license](${licenseLink})\n

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
\n`
  };

}

// TODO: Create a function to generate markdown for README
function generateMarkdown(data) {

  let licenseSection = renderLicenseSection(data.projectLicense);
  let titleSection = data.projectTitle.split(' ').join('_');;

  return `
  # <${titleSection}>\n
  ## Description\n ${data.projectDescription}\n
  ## Table of contents\n
  - [Installation](#installation)
  - [Usage](#usage)
  - [Credits](#credits)
  - [License](#license)\n
  ## Instalation\n The page can be accessed by clikcing [this link](${data.projectURL})\n
  ## Usage\n Below is a screenshot of the page\n ![a screenshot of my page](${data.projectImage})\n
  ## Credits\n Credits go to ${data.projectCreds}\n
  ${licenseSection}\n
  ## Features\n ${data.projectFeatures}\n
  ## How to contribute\n ${data.projectContribute}\n
  ## Tests\n ${data.projectTests}
  `;
}

module.exports = generateMarkdown;
