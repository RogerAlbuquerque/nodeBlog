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
  Categori.find().sort({date:"desc"}).then((categories) => {
    const data = categories.map((result) => result.toJSON())

    res.render("admin/categories", {categories: data})

    
  }).catch(err =>{
      req.flash("error_msg", "Deu caquinha ai dá um bizu")
      res.redirect("/admin")
  })
  
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

router.get("/categories/edit/:id", (req,res)=> {

Categori.findOne({_id:req.params.id}).lean().then((categori) => {
  
  console.log(categori)

  res.render("admin/editCategori", {categori: categori})

})
.catch(err =>{
  console.log(err)
  // req.flash("error_msg", "Categoria não existe")
  // res.redirect("/admin/categories")
})
})

router.post("/categories/edit", (req,res) => {
  Categori.findOne({_id: req.body.id}).then(categori => {
    categori.nome = req.body.name
    categori.slug = req.body.slug

    categori.save().then(() =>{
      req.flash("success_msg", "Categoria editada com sucesso")
      res.redirect("/admin/categories")
    }).catch(err => {
      req.flash("error_msg", "Deu caga se virra ai")
      res.redirect("/admin/categories")
    })
  })

  .catch(err => {
    req.flash("error_msg", "Deu caga se vira ai")
    res.redirect("/admin/categories")

    console.log(err)
  })
})

router.post("/categories/delete", (req,res) => {
  Categori.deleteOne({_id:req.body.id})
  .then(() =>{
    req.flash("success_msg", "Categoria removida com sucesso")
    res.redirect("/admin/categories")
  }).catch(err => {
    req.flash("error_msg", "Deu caga se vira ai")
    res.redirect("/admin/categories")
  })
})


module.exports = router;