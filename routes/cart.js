const router = require("express").Router();
const db = require("../lib/db");
const verifyToken = require("../middleware/authMiddleware");

router.get("/", verifyToken, async function (req, res) {
  try {
    const { rows } = await db.query("SELECT * FROM cart WHERE customer_id=$1", [
      req.userId,
    ]);
    res.send(rows);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.post("/add", verifyToken, async function (req, res) {
  try {
    const { quantity, productId } = req.body;
    await db.query(
      `INSERT INTO cart(quantity,product_id,order_status,customer_id) VALUES($1,$2,$3,$4)`,
      [quantity, productId, false, req.userId]
    );
    res.send("Product added to cart");
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.delete("/:id", verifyToken, async function (req, res) {
  try {
    let { id } = req.params;
    id = parseInt(id);
    await db.query(`DELETE FROM cart WHERE cart_id=$1 AND customer_id=$2`, [
      id,
      req.userId,
    ]);
    res.send("Product removed from cart");
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

module.exports = router;
