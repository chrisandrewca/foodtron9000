const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');

const app = express();
app.use(logger('dev')); // TODO process.env
app.use(helmet());

app.use(express.json({ verify: (req, res, buf, enc) => {
  // TODO could optimize this - and avoid 2x the work (rawBody + json parse)
  if (req.originalUrl.endsWith('stripe/hook')) {
    req.rawBody = buf.toString();
  }
}}));

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  req.scoped = {}; // reset the scope for each request
  next();
});

app.use(require('./session/order-session'));

app.use('/api/auth', require('./endpoints/auth'));
app.use('/api/buy', require('./endpoints/buy'));
app.use('/api/error', require('./endpoints/error'));
app.use('/api/order', require('./endpoints/order'));
app.use('/api/product', require('./endpoints/product'));
app.use('/api/profile', require('./endpoints/profile'));
app.use('/api/start', require('./endpoints/start'));
app.use('/api/stripe', require('./endpoints/stripe'));

// catch 404 and forward to error handler
app.use((req, res, next) => {

  const err = new Error('');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // console.dir({ err }, { depth: null });
  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
