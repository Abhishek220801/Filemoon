const { Schema, model } = require("mongoose")
const bcrypt = require('bcrypt');

const userSchema = new Schema(
  {
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1475403614135-5f1aa0eb5015?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    firstname: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    lastname: {
      type: String,
      trim: true,
      lowercase: true,
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
    mobile: {
      type: Number,
      required: true,
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
  const count = await this.constructor.countDocuments({ email: this.email })

  if (count > 0) {
    throw new Error("Email already registered with another account")
  }
})

userSchema.pre("save", async function () {
  const count = await this.constructor.countDocuments({ mobile: this.mobile })

  if (count > 0) {
    throw new Error("Mobile number already registered with another account")
  }
})

userSchema.pre("save", async function () {
    const encryptedPassword = await bcrypt.hash(this.password.toString(), 12);
    this.password = encryptedPassword
})

const UserModel = model("User", userSchema)

module.exports = UserModel
