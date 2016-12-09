const run = require('./app/run');
const config = require('./app/config');
const controllers = require('./app/controllers');
const services = require('./app/services');

// Create the app module and name it.
const app = angular.module('managementApp', [
  'ngRoute',
  'ngAnimate',
  'ngTouch',
  'ui.bootstrap',
  'ngFileUpload',
]);

// Add controllers dynamically
for (let key in controllers) {
  if (controllers.hasOwnProperty(key)) {
    const controller = controllers[key];
    app.controller(key, controller);
  }
}

// Add services dynamically
for (let key in services) {
  if (services.hasOwnProperty(key)) {
    const service = services[key];
    app.service(key, service);
  }
}

// Set app config
app.config(config);

// Set app run commands
app.run(run);

angular.element(function() {
  angular.bootstrap(document, ['managementApp']);
});
