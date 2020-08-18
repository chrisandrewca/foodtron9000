const express = require('express');
const logger = require('morgan');

const app = express();
app.use(logger('dev')); // TODO process.env
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/product', require('./endpoints/product'));
app.use('/api/start', require('./endpoints/start'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {

  const err = new Error('');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // console.dir({ err }, { depth: null });
  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
