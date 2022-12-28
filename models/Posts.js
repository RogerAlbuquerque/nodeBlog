const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Post = new Schema ({
  title:{
    type: String,
    required:true
  },
  
  slug:{
    type: String,
    required:true
  },
  
  description:{
    type: String,
    required:true
  },
  
  content:{
    type: String,
    required:true
  },

  date:{
    type: Date,
    default: Date.now()
  },
  
  categori:{
    type: Schema.Types.ObjectId,    // Esse aqui é um campo que vai armazenar o ID de uma categoria.
    ref:"categories",
    required:true
  }
  
})

mongoose.model("posts", Post);