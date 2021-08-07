var fs = require('fs');

require('dotenv').config({path: '/tmp/.env'});

let backendURI = "";

if (process.env.BACKEND_URI !== undefined && process.env.BACKEND_URI !== null && process.env.BACKEND_URI !== '') {
  backendURI = process.env.BACKEND_URI;
} else {

  if (process.env.APP_MODE === 'production') {
    backendURI += "https://";
  } else if (process.env.APP_MODE === 'debug' || process.env.APP_MODE === 'test' || process.env.APP_MODE === 'development' || process.env.APP_MODE === 'cypress') {
    backendURI += "http://";
  } else {
    console.log("Unknown APP MODE: " + process.env.APP_MODE);
    backendURI += "http://";
  }

  backendURI += process.env.BACKEND_HOST;
  backendURI += ":";
  backendURI += process.env.BACKEND_PORT;

  backendURI += process.env.BACKEND_PREFIX;

}

let websocketsURI = "";
websocketsURI += process.env.PUSHPIN_HOST;
websocketsURI += ":";
websocketsURI += process.env.PUSHPIN_PORT;

let apiUrl = backendURI + '/api';
let authApiUrl = backendURI + '/auth';

let projectTitle = process.env.PROJECT_TITLE;
let projectDescription = process.env.PROJECT_DESCRIPTION;

let allowRegistration = process.env.ALLOW_REGISTRATION.toLowerCase() === 'true';
let allowPasswordReset = process.env.ALLOW_PASSWORD_RESET.toLowerCase() === 'true';
let enableToastr = process.env.ENABLE_TOASTR.toLowerCase() === 'true';

// Trimming ' character from title and description
if (projectTitle.charAt(0) === "'") {
  projectTitle = projectTitle.substr(1);
}
if (projectDescription.charAt(0) === "'") {
  projectDescription = projectDescription.substr(1);
}
if (projectTitle.slice(projectTitle.length -1) === "'") {
  projectTitle = projectTitle.slice(0, -1);
}
if (projectDescription.slice(projectDescription.length -1) === "'") {
    projectDescription = projectDescription.slice(0, -1);
}

// apiUrl = JSON.stringify(apiUrl);
// authApiUrl = JSON.stringify(authApiUrl);
// projectTitle = JSON.stringify(projectTitle);
// projectDescription = JSON.stringify(projectDescription);
// allowRegistration = JSON.stringify(allowRegistration);
// allowPasswordReset = JSON.stringify(allowPasswordReset);

const targetPath = `/tmp/environment.variables.ts`;

const envConfigFile = `
export const environment = { 
    apiUrl: '${apiUrl}',
    authApiUrl: '${authApiUrl}',
    projectTitle: '${projectTitle}',
    projectDescription: '${projectDescription}',
    allowRegistration: '${allowRegistration}',
    allowPasswordReset: '${allowPasswordReset}',
    websocketsUrl: '${websocketsURI}',
    enableToastr: '${enableToastr}'
};
`
fs.writeFile(targetPath, envConfigFile, function (err) {
    if (err) { 
      console.log(err);
    }
  }
);
