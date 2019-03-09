const router = require('express')
  .Router();

router
  .get('/', function (req, res) {
    res.json('home')
  });

module.exports = router;