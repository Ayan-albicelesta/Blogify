const crypto = require("crypto");

const { Schema, model } = require("mongoose");

const{createTokenForUser,validateToken}=require('../utility/auth.js')

const userSchema = new Schema(
  {
    //we have not written mongoose.Schema as we have destructured {Schema} while requiring
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.jpg",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this; //will give accesss to the scheama

  if (!user.isModified("password")) return;

  const salt = crypto.randomBytes(8).toString(); //this is private key
  const hashedPassword = crypto
    .createHmac("sha256", salt)
    .update(user.password)
    .digest("hex"); //hashing password

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
  const user = await User.findOne({ email });

  if (user) {
    const salt = user.salt;
    const hashedPassword = user.password;

    const userProviderHash = crypto//creating hash based upon data given by user in req
      .createHmac("sha256", salt)
      .update(password)//this password from req body
      .digest("hex");

    if (hashedPassword != userProviderHash) {
      throw new Error("User or Password is incorrect");
    } else {
        const token=createTokenForUser(user)//if password is matched then create JWT token
        return token;//return token 
    }


  } else {
    throw new Error("User not found");
  }
});

const User = model("User", userSchema);

module.exports = User;
