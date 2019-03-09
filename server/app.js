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
  .use('/auth', require('./components/auth'))
  .use('/todos', jwt, require('./components/todo'))
  .use('/user', jwt, require('./components/user'))
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
