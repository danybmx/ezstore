const app = require('koa')();
const router = require('koa-router')();
const glob = require('glob');
const Pug = require('koa-pug');

// Template engine
const pug = new Pug({
  viewPath: './app/views',
  debug: false,
  pretty: false,
  compileDebug: false,
  locals: {},
});
pug.use(app);

// Add controller routers to the router
const controllers = glob.sync('./app/controllers/**/*.js');
controllers.forEach((file) => {
  controller = require(file);
  router.use(controller.path, controller.router.routes());
});

// Attach router to the app
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
