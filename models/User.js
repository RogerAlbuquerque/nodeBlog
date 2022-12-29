const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
name:{
  type: String,
  requires: true
},
email:{
  type: String,
  requires: true
},

isAdmin: {
  type:Number,
  default:0       // 0 é usuário, 1 vai ser admin
},
password:{
  type: String,
  requires: true
}
})


mongoose.model("users", User)