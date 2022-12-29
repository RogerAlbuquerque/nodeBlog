const localStrategy = require("passport-local");
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Model de usuário
require("../models/User")
const User = mongoose.model("users")


module.exports = function (passport) {
                                    
                              // isso aqui ta indicado qual campo vai ser analisado na autenticação
  passport.use(new localStrategy({usernameField: 'email', passwordField: 'password'}, (email, password, done) =>{

  User.findOne({email: email}) // Aqui ele vai buscar um usuário que tenha um email igual ao email passado na autenticação
  .then( user => {
    if(!user){
      return done(null,false, {message: "Esta conta não existe"})
    }

    bcrypt.compare(password, user.password, (error, batem)=>{
      if(batem){
        return done(null, user)
      }
      else {
        return done(null,false, {message: "Senha incorreta"})
      }
    })
  })   

  })) 

  // As funções abaixo servem para salvar os dados do usuário em uma seção

  passport.serializeUser((user, done)=>{
    
    done(null, user.id)  //Isso aqui vai passar os dados do usuário para uma seção.

  })

  passport.deserializeUser((id, done)=>{
    
    User.findById(id, (err, user) => {    // Essa aqui vai procurar o usuário pelo id
        done(err,user)
    })

  })

  



}