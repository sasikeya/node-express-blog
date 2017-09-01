var path = require('path')
var express = require('express')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var RedisStrore = require('connect-redis')(session)
var flash = require('connect-flash')
var config = require('config-lite')(__dirname)
var pkg = require('./package')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// session 中间件
app.use(session({
  name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true,// 强制更新 session
  saveUninitialized: false,// 设置为 false，强制创建一个 session，即使用户未登录
  cookie: {
    maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
  },
  store: new RedisStrore({
    "host": "r-uf673861606ad1e4.redis.rds.aliyuncs.com",
    "pass": "Chenziheng1025",
    "port": "6379"
  })
}))
// flash 中间件，用来显示通知
app.use(flash())


// 路由
var index = require('./routes/index')
var users = require('./routes/users')
var signup = require('./routes/signup')
var signin = require('./routes/signin')
var signout = require('./routes/signout')
var posts = require('./routes/posts')

app.use('/', index)
app.use('/users', users)
app.use('/signup', signup)
app.use('/signin', signin)
app.use('/signout', signout)
app.use('/posts', posts)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
