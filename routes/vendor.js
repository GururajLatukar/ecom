const router = require("express").Router();
const db = require("../lib/db");
const verifyToken = require('../middleware/authMiddleware')

router.post("/profile/edit",verifyToken, async function (req, res) {
  try {
    const {
      name,
      email,
      password,
      contact_no,
      shop_name,
      shop_location,
      aadhaar_no,
    } = req.body;
    const vendorId = req.userId;
    await db.query(
      `UPDATE vendor SET name=$1,password=$2,email=$3,contact_no=$4,shop_name=$5,shop_location=$6,aadhaar_no=$7 WHERE vendor_id=$8`,
      [name, password, email, contact_no, shop_name, shop_location, aadhaar_no, vendorId]
    );
    res.send("Profile Updated");
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

module.exports = router;
