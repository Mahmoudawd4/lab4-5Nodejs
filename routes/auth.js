const express = require("express");
const { User, validateUser } = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const hashed = await bcrypt.hash(req.body.password, 10)
    const user = new User({ ...req.body, password: hashed });
    const result = await user.save();
    res.status(201).json({ _id: result._id })
})

router.post("/login", async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ message: "wrong email or password" })

    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(401).json({ message: "wrong email or password" })

    const token = jwt.sign({
        _id: user._id,
        isAdmin: user.isAdmin,
        email: user.email
    },process.env.SECERT_key)
    res.json({ token })
})

module.exports = router