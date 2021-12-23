"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var helmet_1 = __importDefault(require("helmet"));
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
require('dotenv').config();
var compression = require('compression');
var favicon = require('serve-favicon');
var cors = require('cors');
// Import routes
var index_1 = __importDefault(require("./routes/index"));
var api_1 = __importDefault(require("./routes/api"));
// Import Strategies
require('./strategies/passportJWT');
var app = (0, express_1.default)();
// Enable all traffic DANGEROUS GOING TO CHANGE
app.use(cors());
// Compress all routes
app.use(compression());
app.use((0, helmet_1.default)());
// app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
// hello
// Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = process.env.DEV_MONGODB_URI || process.env.MONGODB_URI;
console.log('What is mongoDB');
console.log({ mongoDB: mongoDB });
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// View engine setup
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path_1.default.join(__dirname, 'public'),
    dest: path_1.default.join(__dirname, 'public'),
    indentedSyntax: false,
    sourceMap: true
}));
console.log('waht is __dirname');
console.log(__dirname);
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Add routes to middleware
app.use('/', index_1.default);
app.use('/api', api_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
