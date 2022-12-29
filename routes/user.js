const express  = require("express");
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const router   = express.Router();

require("../models/User")

const User = mongoose.model("users")

// ROTAS
  router.get("/register", (req,res) => {
    res.render("user/register")
  })

  router.post("/register", (req,res) => {

    var errors = []

    if(!req.body.name || typeof req.body.name == undefined || req.body.name== null){
      errors.push({text: "Nome inválido"})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email== null){
      errors.push({text: "email inválido"})
    }

    if(!req.body.password || typeof req.body.password == undefined || req.body.password== null){
      errors.push({text: "Senha inválida"})
    }

    if(req.body.password.length < 4){
      errors.push({text: "Senha muito curta"})
    }

    if(req.body.password != req.body.password2){
      errors.push({text: "As senhas são diferentes, tente novamente"})
    }


    if(errors.length > 0){
      res.render("user/register", {errors: errors})
    }else{

      User.findOne({email: req.body.email}).then(user => {
        if(user){
          req.flash("error_msg", "Já existe uma conta com esse e-mail no sistema ")
          res.redirect("/user/register")
        }else{
          const newUser = new User({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
          })
          //ANTES DE SALVAR NO BANCO PRECISAR CONVERTER A SENHA EM HASH COMO BCRYPT
          bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(newUser.password, salt, (error, hash) => {
              if(error){
                req.flash("error", "Erro ao criar senha ")
                res.redirect("/user/register")
              }

              newUser.password = hash

              newUser.save().then(() =>{
                req.flash("success_msg", "Conta criada com sucesso")
                res.redirect("/")
              }).catch(err => {
                console.log("Deu erro: ", err)
                req.flash("error_msg", "Erro ao criar senha ")
                res.redirect("/user/register")
              })

            })
          })

        }

      }).catch(err =>{
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/")
      })


    }

  })

  router.get("/login", (req,res) => {
    res.render("user/login")
  })





module.exports = router;

