const express   = require('express');
const router    = express.Router();
const mongoose  = require('mongoose');
const {isAdmin} = require('../helper/isadmin')
require("../models/Categori");
require("../models/Posts");


const Categori = mongoose.model("categories")
const Post = mongoose.model("posts")

router.get('/', isAdmin, (req,res)=>{
  res.render("admin/index")
});

router.get('/categories', isAdmin, (req,res)=>{
  Categori.find().sort({date:"desc"}).then((categories) => {
    const data = categories.map((result) => result.toJSON())

    res.render("admin/categories", {categories: data})

    
  }).catch(err =>{
      req.flash("error_msg", "Deu caquinha ai dá um bizu")
      res.redirect("/admin")
  })
  
});


router.get('/categories/add', isAdmin, (req,res)=>{
  res.render("admin/addcategories")
});

router.post('/categories/new', isAdmin, (req,res)=>{

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

router.get("/categories/edit/:id", isAdmin, (req,res)=> {

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

router.post("/categories/edit", isAdmin, (req,res) => {
  Categori.findOne({_id: req.body.id}).then(categori => {
    categori.nome = req.body.name
    categori.slug = req.body.slug

    categori.save().then(() =>{
      req.flash("success_msg", "Categoria editada com sucesso")
      res.redirect("/admin/categories")
    }).catch(err => {
      req.flash("error_msg", "Deu caga se vira ai")
      res.redirect("/admin/categories")
    })
  })

  .catch(err => {
    req.flash("error_msg", "Deu caga se vira ai")
    res.redirect("/admin/categories")

    console.log(err)
  })
})

router.post("/categories/delete", isAdmin, (req,res) => {
  Categori.deleteOne({_id:req.body.id})
  .then(() =>{
    req.flash("success_msg", "Categoria removida com sucesso")
    res.redirect("/admin/categories")
  }).catch(err => {
    req.flash("error_msg", "Deu caga se vira ai")
    res.redirect("/admin/categories")
  })
})


// ROTAS DE POSTAGENS

router.get("/posts", isAdmin, (req,res) => {
  Post.find().populate("categori").sort({data:"desc"})
  .then(posts => {
    res.render("admin/posts", {posts: posts.map(result => result.toJSON())})
  })
  .catch(err =>{
    req.flash("error_msg", "Deu caga se vira ai")
    res.redirect("/admin")
    console.log(err);
  })

 
})

router.get("/posts/add", isAdmin, (req,res) => {
  Categori.find()
  .then((categori) =>{
    res.render("admin/addposts", {categori:categori.map(result => result.toJSON())})
  }).catch(err => {
    req.flash("error_msg", "Deu caga se vira ai")
    res.redirect("/admin")
  })
  
})

router.post("/posts/new", isAdmin, (req,res) => {
  let error = []
  if(req.body.categori == "0"){
    error.push({text: "Categoria inválida, registere uma categoria"})
  }
  if(error.length > 0){
    res.render("admin/addposts", {error: error})
  }else{
    const newPost = {
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      categori: req.body.categori,
      slug: req.body.slug,
    }

    new Post(newPost).save().then(() =>{
      req.flash("success_msg", "Postagem criada com sucesso")
      res.redirect("/admin/categories")
    }).catch(err => {
      req.flash("error_msg", "Deu caga se vira ai")
      res.redirect("/admin/posts")
      console.log(err);
    
  })
  }


})

router.get("/posts/edit/:id" , isAdmin, (req,res) => {

    Post.findOne({_id: req.params.id}).lean().then(posts =>{
      
      Categori.find().lean().then(categories => {
       
          res.render("admin/editposts", {categories:categories, posts: posts})

      }).catch(err => {
          console.log("categori error: ", err)
      })
    })
    .catch(err=> {
        console.log("Post error: ", err)
    })
  
  
})

router.post("/posts/edit", isAdmin, (req,res) => {

  Post.findOne({_id: req.body.id})
  .then(post =>{
    post.title =req.body.title;
    post.slug =req.body.slug;
    post.description =req.body.description;
    post.content =req.body.content;
    post.categori =req.body.categori;

    post.save().then(() =>{
      req.flash("success_msg", "Postagem editada com sucesso")
      res.redirect("/admin/posts")
    })  
    

  })
  .catch(err => {
    req.flash("error_msg", "Deu caga se vira ai")
    res.redirect("/admin/posts")
    console.log(err)
  })
})

router.get("/posts/delete/:id", isAdmin, (req,res) => {
  Post.deleteOne({_id:req.params.id}).then(() => {
    req.flash("success_msg", "Postagem deletada com sucesso")
    res.redirect("/admin/posts")
  })
})


module.exports = router;