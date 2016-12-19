const router = require('koa-router')();
const usersApi = require('../api/users');

router.get('/sign', function* () {
  this.render('users/sign');
});

router.post('/login', function* () {
  yield (cb) => {
    const authToken = usersApi.login(
      this.request.body.email, this.request.body.password
    ).then((res) => {
      if (authToken.token) {
        const user = usersApi.me(authToken.token).then((res) => {
          this.session.user = user;
          this.redirect(this.session.redirectAfterLogin || '/');
          cb();
        });
      } else {
        this.session.flash = 'Ha ocurrido un error al intentar acceder con el usuario';
        this.redirect('/sign#error');
        cb();
      }
    });
  };
});

router.post('/register', function* () {
  const userData = {
    email: this.request.body.email,
    password: this.request.body.password,
    firstName: this.request.body.firstName,
    lastName: this.request.body.lastName,
    roles: ['USER'],
  };
  try {
    const user = yield usersApi.register(userData);
    if ( ! user) {
      this.session.flash = 'Ha ocurrido un error creando el usuario';
      return this.redirect('/sign#error');
    }

    const authToken = yield usersApi.login(
      user.email, this.request.body.password
    );

    if (authToken.token) {
      const user = yield usersApi.me(authToken.token);
      this.session.user = user;
      this.redirect(this.session.redirectAfterLogin || '/');
    } else {
      this.session.flash = 'Ha ocurrido un error al intentar acceder con el usuario';
      this.redirect('/sign#error');
    }
  } catch(err) {
    console.log(err);
  }
});

router.get('/profile', function* () {
  if (this.user) {
    this.render('users/profile');
  } else {
    this.session.flash = 'Antes necesitas acceder a tu cuenta';
    this.redirect('/');
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
