const router = require("express").Router();
const db = require("../lib/db");
const verifyToken = require('../middleware/authMiddleware')

router.post("/add", verifyToken, async function (req, res) {
  try {
    const {
      company_name,
      model_name,
      model_specification,
      price,
      discount,
      quantity,
    } = req.body;

    const vendor_id = req.userId;

    await db.query(
      `INSERT INTO product(company_name, model_name, model_specification, price, discount, quantity,vendor_id) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        company_name,
        model_name,
        model_specification,
        price,
        discount,
        quantity,
        vendor_id,
      ]
    );
    res.status(200).send("Product added");
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.post("/:id/edit", verifyToken, async function (req, res) {
  try {
    let {id} = req.params;
    id = parseInt(id);

    const {
      company_name,
      model_name,
      model_specification,
      price,
      discount,
      quantity
    } = req.body;

    await db.query(
      `UPDATE product SET company_name=$1, model_name=$2, model_specification=$3, price=$4, discount=$5, quantity=$6 WHERE product_id=$7`,
      [
        company_name,
        model_name,
        model_specification,
        price,
        discount,
        quantity,
        id
      ]
    );
    res.status(200).send("Product updated");
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.get("/", async function (req, res) {
  try {
    const { rows } = await db.query("SELECT * FROM PRODUCT");
    res.status(200).send(rows);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/:id", async function (req, res) {
  try {
    let {id} = req.params;
    id = parseInt(id);
    const { rows } = await db.query("SELECT * FROM PRODUCT WHERE product_id= $1",[id]);
    res.status(200).send(rows);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/:id", verifyToken, async function (req, res) {
    let {id} = req.params;
    id = parseInt(id);
    try {
      await db.query("DELETE FROM PRODUCT WHERE product_id= $1",[id]);
      res.status(200).send("Product deleted");
    } catch (err) {
      res.status(400).send(err);
    }
  });

module.exports = router;
