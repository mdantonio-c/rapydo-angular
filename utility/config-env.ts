const { Console } = require("console");
const print = new Console(process.stdout, process.stderr);

var fs = require("fs");

require("dotenv").config({ path: "/tmp/.env" });

let backendURI = "";

if (
  typeof process.env.BACKEND_URI !== "undefined" &&
  process.env.BACKEND_URI !== null &&
  process.env.BACKEND_URI !== ""
) {
  backendURI = process.env.BACKEND_URI;
} else {
  if (process.env.APP_MODE === "production") {
    backendURI += "https://";
  } else if (
    process.env.APP_MODE === "debug" ||
    process.env.APP_MODE === "test" ||
    process.env.APP_MODE === "development" ||
    process.env.APP_MODE === "cypress"
  ) {
    backendURI += "http://";
  } else {
    print.error("Unknown APP MODE: " + process.env.APP_MODE);
    backendURI += "http://";
  }

  backendURI += process.env.BACKEND_HOST;
  backendURI += ":";
  backendURI += process.env.BACKEND_PORT;

  backendURI += process.env.BACKEND_PREFIX;
}

// Trimming ' character from title and description
let projectTitle = process.env.PROJECT_TITLE;
if (projectTitle.charAt(0) === "'") {
  projectTitle = projectTitle.substr(1);
}
if (projectTitle.slice(projectTitle.length - 1) === "'") {
  projectTitle = projectTitle.slice(0, -1);
}

let projectDescription = process.env.PROJECT_DESCRIPTION;
if (projectDescription.charAt(0) === "'") {
  projectDescription = projectDescription.substr(1);
}
if (projectDescription.slice(projectDescription.length - 1) === "'") {
  projectDescription = projectDescription.slice(0, -1);
}

let websocketsURI = "";
websocketsURI += process.env.PUSHPIN_HOST;
websocketsURI += ":";
websocketsURI += process.env.PUSHPIN_PORT;

const targetPath = `/tmp/environment.variables.ts`;
const INJECT_KEY = "INJECT_";

let envConfigFile = `
export const environment = { 
    backendURI: '${backendURI}',
    projectVersion: '${process.env.VERSION}',
    rapydoVersion: '${process.env.RAPYDO_VERSION}',
    projectName: '${process.env.VANILLA_PACKAGE}',
    projectTitle: '${projectTitle}',
    projectDescription: '${projectDescription}',
    enableFooter: '${process.env.ENABLE_FOOTER}',
    allowRegistration: '${process.env.ALLOW_REGISTRATION}',
    allowPasswordReset: '${process.env.ALLOW_PASSWORD_RESET}',
    allowTermsOfUse: '${process.env.ALLOW_TERMS_OF_USE}',
    minPasswordLength: '${process.env.AUTH_MIN_PASSWORD_LENGTH}',
    websocketsUrl: '${websocketsURI}',`;
for (let key in process.env) {
  if (key.startsWith(INJECT_KEY)) {
    let k = key.substr(INJECT_KEY.length);
    envConfigFile += `
    ${k}: '${process.env[key]}',`;
  }
}
envConfigFile += `  
    SENTRY_URL: '${process.env.SENTRY_URL}',
    GA_TRACKING_CODE: '${process.env.GA_TRACKING_CODE}'
};
`;
fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    print.error(err);
  }
});
