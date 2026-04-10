const express = require("express");
const router = express.Router();

const {login} = require("../login/login_controller")

router.post("/login", login);

module.exports = router;