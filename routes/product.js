const router = require("express").Router();
const db = require("../lib/db");

router.post("/product/addProduct", async function (req, res) {
  try {
    const { data } = req.body;
    const {
      company_name,
      model_name,
      model_specification,
      price,
      discount,
      quantity,
      vendor_id,
    } = data;

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

router.post("/product/editProduct", async function (req, res) {
  try {
    const { data } = req.body;
    const {
      company_name,
      model_name,
      model_specification,
      price,
      discount,
      quantity,
      vendor_id,
    } = data;

    await db.query(
      `UPDATE product SET company_name=$1, model_name=$2, model_specification=$3, price=$4, discount=$5, quantity=$6,vendor_id=$7`,
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
    res.status(200).send("Product updated ");
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.get("/", async function (req, res) {
  try {
    const { rows } = await db.query("SELECT * FROM PRODUCT");
    res.status(200).send(rows[0]);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/product/getById", async function (req, res) {
  try {
    const { rows } = await db.query("SELECT * FROM PRODUCT WHERE id= $1",[req.query.id]);
    res.status(200).send(rows[0]);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/product/deleteProduct", async function (req, res) {
    try {
      const { rows } = await db.query("DELETE FROM PRODUCT WHERE id= $1",[req.query.id]);
      res.status(200).send(rows[0]);
    } catch (err) {
      res.status(400).send(err);
    }
  });

module.exports = router;
