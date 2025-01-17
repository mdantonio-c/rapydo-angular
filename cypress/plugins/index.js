module.exports = (on, config) => {
  require("@cypress/code-coverage/task")(on, config);
  require("cypress-fail-fast/plugin")(on, config);

  // add other tasks to be registered here

  // IMPORTANT to return the config object
  // with the any changed environment variables
  return config;
};
