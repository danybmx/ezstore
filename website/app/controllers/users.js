const router = require('koa-router')();
const usersApi = require('../api/users');

router.get('/sign', function* () {
  this.render('users/sign');
});

router.post('/login', function* () {
  const authToken = yield usersApi.login(
    this.request.body.email, this.request.body.password
  );
  if (authToken.token) {
    const user = yield usersApi.me(authToken.token);
    this.session.user = user;
    this.redirect(this.session.redirectAfterLogin || '/');
  } else {
    this.redirect('/sign#error');
  }
});

router.get('/logout', function* () {
  this.session.user = null;
  this.redirect('/');
});

module.exports = {
    path: '',
    router: router,
};
