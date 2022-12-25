const mongoose = require('mongoose');
const Schema = mongoose.Schema

//Definindo o model
  const Categori = new Schema({

    name:{
      type:String,
      require:true
    },

    slug:{
      type:String,
      require:true
    },

    date:{
      type:Date,
      default:Date.now()
    }

  })

//Collection
mongoose.model('categories', Categori);
