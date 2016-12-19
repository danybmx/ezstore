const app = require('koa')();
const router = require('koa-router')();
const body = require('koa-body')();
const static = require('koa-static');
const session = require('koa-generic-session');
const Pug = require('koa-pug');
const glob = require('glob');
const path = require('path');
const config = require('./app/config');

// Template engine
const pug = new Pug({
  viewPath: './app/views',
  debug: false,
  noCache: true,
  pretty: false,
  compileDebug: false,
  helperPath: ['./app/helpers'],
  locals: {
    config,
    app,
  },
});
pug.use(app);

// Body parser
app.use(body);

// Add koa sessions
app.keys = config.appKeys;
app.use(session({
  key: 'store.sess',
}, app));

// Shopcart sessions
app.use(function* (next) {
  if (!this.session.shopcart) {
    this.session.shopcart = {
      products: [],
      shipping: 9,
      subtotal: 0,
      total: 0,
      shippingAddress: {},
    };
  }
  pug.locals.shopcart = this.session.shopcart;
  yield next;
});

// User & flash injection
app.use(function* (next) {
  this.user = pug.locals.user = null;
  pug.locals.session = Object.assign({}, this.session);
  if (this.session.flash) this.session.flash = null;
  if (this.session.user) {
    this.user = this.session.user;
    pug.locals.user = this.user;
  }
  yield next;
});

// Add error handling middleware
app.use(function* (next) {
  try {
    yield next;
  } catch (err) {
    this.status = err.status || 500;
    this.body = err.message;
    this.app.emit('error', err, this);
  }
});

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

// Serve static files
app.use(static(path.join(__dirname, 'static')));

app.listen(config.port);
