const Router = require("express");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const router = new Router();
const authMiddleware = require("../middleware/auth.middleware");
const authController = require("../controllers/authController");

router.post(
  "/registration",
  authController.registration
);

router.post("/login", authController.login);

router.get("/auth", authMiddleware, authController.auth);

module.exports = router;