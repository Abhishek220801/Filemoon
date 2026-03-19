const { Schema, model } = require("mongoose")
const bcrypt = require('bcrypt');

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        { message: "Invalid Email Address" },
      ],
      unique: true,
    },
    password: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
)

userSchema.pre("save", async function () {
  const count = await this.constructor.countDocuments({ mobile: this.mobile })

  if (count > 0) {
    throw new Error("Mobile Number already registered with another account")
  }
})

userSchema.pre("save", async function () {
  const count = await this.constructor.countDocuments({ mobile: this.email })

  if (count > 0) {
    throw new Error("Email already registered with another account")
  }
})

userSchema.pre("save", async function () {
    const encryptedPassword = await bcrypt.hash(this.password.toString(), 12);
    this.password = encryptedPassword
})

const UserModel = model("User", userSchema)

module.exports = UserModel
