const UserModel = require("../model/user.model.js")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    await UserModel.create(req.body)
    res.status(200).json({ message: "User registered successfully" })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.findOne(
      { email },
      { createdAt: 0, updatedAt: 0, __v: 0 },
    )
    if (!user) return res.status(404).json({ message: "User does not exist" })

    const passwordCorrect = bcrypt.compareSync(password, user.password)

    if (!passwordCorrect)
      return res.status(401).json({ message: "Incorrect password" })

    const payload = {
      email: user.email,
      mobile: user.mobile,
      firstname: user.firstname,
      lastname: user.lastname,
      id: user._id
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '7d'})

    res.status(200).json({ message: "Login success", token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  signup,
  login,
}
