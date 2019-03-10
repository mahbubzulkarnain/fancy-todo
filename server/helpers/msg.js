module.exports = {
  json: function (res, status, response = null, error = null, err = null) {
    if (err) {
      console.error(err)
    }

    res
      .set('X-Powered-By', 'Hacktiv8');

    res
      .status(status.code)
      .json({
        status,
        response,
        error: error
      })
  },
  success: {
    login: {
      message: `Login success`
    }
  },
  error: {
    login: `Invalid username/password`,
    unauthorized: `Unauthorized`
  }
};