require('./config/env')
require('./utils/database')

var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

/**
var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
*/

var bodyParser = require('body-parser') // non-multipart data middleware
var multipartParser = require('multer')() // multipart data middleware

var i18next = require('i18next')
var i18nextMiddleware = require('i18next-http-middleware')
var i18nBackend = require('i18next-fs-backend')
var morgan = require('morgan')
var moment = require('moment')
var fs = require('fs')

var app = express()

/**
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
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
*/

var todayDateString = moment().format('YYYY-MM-DD')
var logDirPath = './logs'
var logFileName = `${todayDateString}.log`
var logFilePath = logDirPath + '/' + logFileName

if (!fs.existsSync(logDirPath)){
    fs.mkdirSync(logDirPath, {
        recursive: true,
    })
}

fs.openSync(logFilePath, 'a+')
var writeFileStream = fs.createWriteStream(logFilePath, {
    flags: 'a',
})
app.use(morgan({
    stream: writeFileStream,
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true,
}))

i18next
    .use(i18nextMiddleware.LanguageDetector)
    .use(i18nBackend)
    .init({
        initImmediate: false,
        debug: true,
        detection: {
            order: ['querystring', 'cookie'],
            caches: ['cookie'],
        },
        backend: {
            loadPath: __dirname + '/resources/locales/{{lng}}/{{ns}}.json',
            // loadPath: __dirname + '/resources/locales/{{lng}}.json',
            ident: 4,
        },
        lng: 'en',
        preload: ['en', 'vi'],
        saveMissing: false,
        fallbackLng: ['en'],
        ns: [
            'auth',
        ],
        defaultNS: [
            'auth',
        ],
    }, (err, t) => {
        console.log('I18n setup fallback')
    })

app.use(i18nextMiddleware.handle(i18next))

app.listen(process.env.APP_PORT)

require('./routes/api/root')(app, multipartParser)

module.exports = app
