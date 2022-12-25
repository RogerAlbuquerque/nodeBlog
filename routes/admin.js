const express= require('express');
const router = express.Router();
const mongoose = require('mongoose');
require("../models/Categori");

const Categori = mongoose.model("categories")

router.get('/', (req,res)=>{
  res.render("admin/index")
});

router.get('/posts', (req,res)=>{
  res.send("posts page")
});

router.get('/categories', (req,res)=>{
  res.render("admin/categories")
});


router.get('/categories/add', (req,res)=>{
  res.render("admin/addcategories")
});

router.post('/categories/new', (req,res)=>{
  const newCategori ={
    name: req.body.name,
    slug: req.body.slug
  }

  new Categori(newCategori).save().then(()=> res.send("Nova categoria adicionada com sucesso"))
});


module.exports = router;