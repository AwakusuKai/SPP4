const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");

exports.registration = async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      return res
        .status(400)
        .json({ message: `User with email ${email} already exist` });
    }
    const hashPassword = await bcrypt.hash(password, 8);
    const user = new User({email, password: hashPassword });
    await user.save();
    return res.json({ message: "User was created" });
  } catch (e) {
    console.log(e);
    res.send({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPassValid = bcrypt.compareSync(password, user.password);
    if (!isPassValid) {
      return res.status(404).json({ message: "Uncorrect password" });
    }
    const token = jwt.sign({ id: user.id }, config.get("secretKey"), {
      expiresIn: "1h",
    });
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (e) {
    console.log(e);
    res.send({ message: "Server error" });
  }
};

exports.auth = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    const token = jwt.sign({ id: user.id }, config.get("secretKey"), {
      expiresIn: "1h",
    });
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (e) {
    console.log(e);
    res.send({ message: "Server error" });
  }
};