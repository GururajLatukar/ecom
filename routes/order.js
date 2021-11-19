const router = require("express").Router();
const db = require("../lib/db");
const verifyToken = require("../middleware/authMiddleware");

router.post("/add", verifyToken, async function (req, res) {
  try {
    const { rows } = await db.query(
      "SELECT * FROM cart WHERE customer_id=$1 and order_status=false",
      [req.userId]
    );

    if (rows.length < 0) {
      return res.status(400).send("Cart is empty");
    }

    let finalTotal = 0;
    let finalDiscount = 0;
    let grandTotal = 0;
    let cartId = [];

    for (let i = 0; i < rows.length; i++) {
      const { cart_id, quantity, product_id } = rows[i];
      cartId.push(cart_id);
      const { rows: data } = await db.query(
        "SELECT * FROM product WHERE product_id=$1",
        [product_id]
      );
      const { price, discount, quantity: prQuantity } = data[0];
      finalDiscount += discount;
      finalTotal += price * quantity;
      // Update cart flag
      await db.query(`UPDATE cart SET order_status=true WHERE cart_id=$1`, [
        cart_id,
      ]);
      // Update product quantity
      await db.query(`UPDATE product SET quantity=$1`, [prQuantity - 1]);
    }

    grandTotal = finalTotal - (finalTotal * finalDiscount) / 100;

    await db.query(
      `INSERT INTO orders(cart_id,total,discount,grand_total,customer_id) VALUES($1,$2,$3,$4,$5)`,
      [cartId, finalTotal, finalDiscount, grandTotal, req.userId]
    );
    res.send("Order Added");
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.get("/", verifyToken, async function (req, res) {
  try {
    const { rows } = await db.query(
      "SELECT * FROM orders WHERE customer_id=$1",
      [req.userId]
    );
    res.send(rows);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.get("/:id", verifyToken, async function (req, res) {
  try {
    let { id } = req.params;
    id = parseInt(id);
    const { rows } = await db.query(
      "SELECT * FROM orders WHERE customer_id=$1 AND order_id=$2",
      [req.userId, id]
    );
    res.send(rows);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

module.exports = router;
