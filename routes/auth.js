const router = require("express").Router();
const db = require("../lib/db");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

async function generateRefreshToken(userId) {
  let expiredAt = new Date();

  expiredAt.setSeconds(
    expiredAt.getSeconds() + process.env.JWTREFRESHEXPIRATION
  );

  let token = uuidv4();

  await db.query('INSERT INTO TOKEN("token","expiry_date","user_id") VALUES($1,$2,$3)', [
    token,
    expiredAt,
    userId
  ]);

  return token;
}

router.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;
    const { rows } = await db.query("SELECT * FROM customer where email=$1", [
      email,
    ]);

    if (rows[0].password !== password) {
      res.status(400).send("Invalid Password");
    }

    const token = jwt.sign({ id: rows[0].id }, process.env.SECRET, {
      expiresIn: process.env.JWTEXPIRATION,
    });

    let refreshToken = await generateRefreshToken(rows[0].customer_id);

    res.status(200).send({
      username: rows[0].id,
      email: rows[0].email,
      accessToken: token,
      refreshToken,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.post("/refreshToken", async function (req, res) {
  try {
    const { refreshToken: requestToken } = req.body;
    if (requestToken == null) {
      return res.status(400).send("Refresh Token is required!");
    }

    const { rows } = await db.query("SELECT * FROM token where token=$1", [
      requestToken,
    ]);

    if (!rows[0].token) {
      return res
        .status(400)
        .send("Refresh token is not in database!");
    }

    if (rows[0].expiry_date.getTime() < new Date().getTime()) {
      await db.query("Delete * FROM token where token=$1", [requestToken]);

      return res.status(400).json("Refresh token was expired. Please make a new signin request");
    }

    let newAccessToken = jwt.sign({ id: rows[0].userId }, process.env.SECRET, {
      expiresIn: process.env.JWTEXPIRATION,
    });

    return res.status(200).send({
      accessToken: newAccessToken,
      refreshToken: rows[0].token,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

module.exports = router;
