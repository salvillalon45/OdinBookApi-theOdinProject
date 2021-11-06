import express from 'express';
import { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import helmet from 'helmet';
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
require('dotenv').config();
const compression = require('compression');
const favicon = require('serve-favicon');

// Import routes
import indexRouter from './routes/index';
import apiRouter from './routes/api';

// Import Strategies
require('./strategies/passportJWT');

const app: Application = express();

// Compress all routes
app.use(compression());

app.use(helmet());

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = process.env.DEV_MONGODB_URI || process.env.MONGODB_URI;
console.log('What is mongoDB');
console.log({ mongoDB });
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
	sassMiddleware({
		src: path.join(__dirname, 'public'),
		dest: path.join(__dirname, 'public'),
		indentedSyntax: false, // true = .sass and false = .scss
		sourceMap: true
	})
);
app.use(express.static(path.join(__dirname, 'public')));

// Add routes to middleware
app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
	next(createError(404));
});

// error handler
app.use(function (
	err: { message: any; status: any },
	req: Request,
	res: Response,
	next: NextFunction
) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
