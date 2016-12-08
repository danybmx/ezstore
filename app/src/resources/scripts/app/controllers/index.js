const modules = [
  require('./dashboard'),
  require('./products'),
  require('./users'),
  require('./categories'),
  require('./brands'),
  require('./storages'),
];

const controllers = {};

for (let i = 0; i < modules.length; i++) {
  Object.assign(controllers, modules[i]);
}

module.exports = controllers;
