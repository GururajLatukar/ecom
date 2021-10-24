const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

const customer = require('./routes/customer');

app.use(express.json());

app.use("/api/customer", customer);

app.listen(port, () => {
  console.log(`server listening at ${port}`)
})