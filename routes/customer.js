const router = require("express").Router();
const db = require('../lib/db');

router.get('/', async function (req, res) {
  const { rows } = await db.query('SELECT * FROM customer')
  res.send(rows[0])
})

module.exports = router;