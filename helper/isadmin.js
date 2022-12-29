module.exports = {
  isAdmin: function(req,res,next){

    if(req.isAuthenticated() && req.user.isAdmin == 1) {
      return next()
    }

    req.flash("error_msg", "Você deve estarr logado para entrar aqui")
    res.redirect("/")
  }
}