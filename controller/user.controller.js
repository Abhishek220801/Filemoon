const userModel = require("../model/user.model");

const signup = (req, res) => {
    try {
        console.log(req.body);
        res.send("success")
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
}

module.exports = {
    signup
}