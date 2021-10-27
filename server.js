const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

const customer = require('./routes/customer');
const auth = require('./routes/auth');

app.use(express.json());

app.use("/api/customer", customer);
app.use("/api/auth", auth);

app.listen(port, () => {
  console.log(`server listening at ${port}`)
})