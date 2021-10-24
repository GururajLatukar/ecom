const express = require('express')
const app = express()
const port = 3000

const db = require('./lib/db');

app.get('/', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM customer')
  res.send(rows[0])
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})