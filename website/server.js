var app = require('koa')();
var router = require('koa-router')();

router.get('/', function *(next) {
	this.body = "Hello /";
});

app
	.use(router.routes())
	.use(router.allowedMethods());

app.listen(3000);