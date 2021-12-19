const router = require("express").Router();
const db = require("../lib/db");
const verifyToken = require('../middleware/authMiddleware')

router.post("/profile/edit", verifyToken, async function (req, res) {
  try {
    const { name, email, password, contact_no, address } = req.body;
    const customerId = req.userId;
    await db.query(
      `UPDATE customer SET name=$1,password=$2,email=$3,contact_no=$4,address=$5 WHERE customer_id=$6`,
      [name, password, email, contact_no, address, customerId]
    );
    res.send("Profile Updated");
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

module.exports = router;
