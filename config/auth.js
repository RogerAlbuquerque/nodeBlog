const localStrategy = require("passport-local");
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Model de usuário
require("../models/User")
const User = mongoose.model("users")


module.exports = function (passport) {
                                    
                              // isso aqui ta indicando qual campo vai ser analisado na autenticação
  passport.use(new localStrategy({usernameField: 'email', passwordField: 'password'}, (email, password, done) =>{

  User.findOne({email: email}) // Aqui ele vai buscar um usuário que tenha um email igual ao email passado na autenticação
  .then( user => {
    if(!user){
      return done(null,false, {message: "Esta conta não existe"}) 
      /* O "done" é uma função de callback que espera um erro como parâmetro e um booleano para confirmar se for autenticado ou não */
    }

    bcrypt.compare(password, user.password, (error, batem)=>{
      if(batem){
        return done(null, user) // Nesse caso se der certo a autenticação, o "done" espera um possível erro e os dados que vão ser salvos na seção
      }
      else {
        return done(null,false, {message: "Senha incorreta"})
      }
    })
  })   

  })) 

 
    /*  As funções abaixo servem para salvar os dados do usuário em uma seção. */
   

/*
  No "serializeUser" após uma autenticação, o passport vai salver em um cookie no frontend,no browser do usuário, os dados 
  do usuário e também vai salvar em uma seção no backend. O serialize serve para dizer o que vai ser salvo nessa sessão e quais as regras para isso
*/
  passport.serializeUser((user, done)=>{
    
    done(null, user.id)   //O primeiro parâmetro pega algum erro, e o segundoo é qual informação do usuário vai ser salva no cookie

  })

  passport.deserializeUser((id, done)=>{ //Essa aqui é para converter a informação do usuáario em bites de novo para passar para a proxima rota reler elas
    
    User.findById(id, (err, user) => {    // Essa aqui vai procurar o usuário pelo id
        done(err,user)
    })

  })
}