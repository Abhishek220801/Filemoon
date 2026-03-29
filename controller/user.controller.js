const UserModel = require("../model/user.model.js")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("node:path")

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

const updateProfileImg = async (req, res) => {
  try {
    const {filename} = req.file;
    const user = await UserModel.findByIdAndUpdate(req.user.id, {image: filename})

    if(!user)
      return res.status(401).json({message: 'Invalid request'});

    res.status(200).json({image: user.image});
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const fetchProfilePic = async (req, res) => {
  try {
    const {image} = await UserModel.findById(req.user.id)

    if(!image){
      return res.status(404).json({ message: "Image not found" })
    }
    
    // If already a remote URL → redirect user there
    if (image.startsWith("http")) {
      return res.redirect(image)
    }

    const root = process.cwd();
    const file = path.join(root, "files", image);
    res.sendFile(file, (err) => {
      if(err)
        res.status(404).json({message: 'Image not found'})
    })
  } catch (err) {
    res.status(500).json({message: err.message});
  }
}

module.exports = {
  signup,
  login,
  updateProfileImg,
  fetchProfilePic
}
