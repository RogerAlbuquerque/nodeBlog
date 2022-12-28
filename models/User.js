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
password:{
  type: String,
  requires: true
}
})


mongoose.model("users", User)