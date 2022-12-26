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

    var error = [];
    if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){

      error.push({text: "Nome inválido"})

    }
    if(req.body.name.length < 2){

      error.push({text: "Nome da categoría muito pequeno"})

    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){

      error.push({text: "Slug inválido"})

    }

     if(error.length > 0) {

      res.render("admin/addcategories", {error: error})   // Aqui está passando parâmetros para o arquivo handlebars

    }
    else{
   
  const newCategori ={
    name: req.body.name,
    slug: req.body.slug
  }

  new Categori(newCategori).save().then(()=> {
    req.flash("success_msg", "Categoria criada com sucesso" )
    res.redirect("/admin/categories")})
    .catch((err) =>{
      req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!" )
      res.redirect("/admin/categories")
    })
}
});


module.exports = router;