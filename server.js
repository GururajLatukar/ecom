const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const product = require("./routes/product");
const customer = require("./routes/customer");
const cart = require("./routes/cart");
const vendor = require("./routes/vendor");
const auth = require("./routes/auth");

app.use(express.json());

app.use("/api/product", product);
app.use("/api/customer", customer);
app.use("/api/cart", cart);
app.use("/api/vendor", vendor);
app.use("/api/auth", auth);

app.listen(port, () => {
  console.log(`server listening at ${port}`);
});
