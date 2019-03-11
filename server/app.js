if (process.NODE_ENV !== 'production') {
  require('dotenv')
    .config()
}

const express = require('express');
const app = express();

const jwt = require('./middlewares/jwt');

require('mongoose')
  .connect(process.env.DATABASE_URL || 'mongodb://localhost/fancytodo', {
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then((prop) => {
    console.log(`${prop.connection.name} connected, port ${prop.connection.port}.`)
  })
  .catch((err) => {
    console.error(err)
  });

app
  .use(express.json())
  .use(express.urlencoded({extended: true}))
  .use(require('cors')())
  .use(require('morgan')('dev'))
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('X-XSS-Protection', '1; mode=block');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'access-control-allow-origin, content-type');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
    res.header('Feature-Policy', 'geolocation \'self\'; midi \'self\'; sync-xhr \'self\'; microphone \'self\'; camera \'self\'; magnetometer \'self\'; gyroscope \'self\'; speaker \'self\'; fullscreen \'self\'; payment \'self\';');
    next();
  })
  .use('/auth', require('./components/auth'))
  .use('/projects', jwt, require('./components/project'))
  .use('/todos', jwt, require('./components/todo'))
  .use('/users', jwt, require('./components/user'))
  .use('/', require('./components/index'));

app
  .use(function (err, req, res, next) {
    if (err && err instanceof String) {
      err = newError(err)
    }
    res.status(res.statusCode === 200 ? 500 : res.statusCode)
      .json({message: err.message})
  })
  .listen(+(process.env.PORT || 3000));
