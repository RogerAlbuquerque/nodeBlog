// Carregando módulos
  const express    = require('express');
  const handlebars = require('express-handlebars');
  const bodyParser = require('body-parser');
  const admin      = require('./routes/admin');
  const users      = require('./routes/user');
  const path       = require('path');
  const mongoose   = require('mongoose') ;
  const session    = require('express-session')
  const flash      = require('connect-flash')
  const passport   = require('passport')

  require("./models/Posts")
  require("./models/Categori")
  
  require("./config/auth")(passport)  // Aqui parece que ta passando o módulo do passport para aqual configuração no auth
  

  const Posts = mongoose.model("posts")
  const Categori = mongoose.model("categories")
  const app        = express();

// Configurações
  //Sessão 
    app.use(session({
      secret: "cursodenode",
      resave: true,
      saveUninitialized: true
    }));

    app.use(passport.initialize())
    app.use(passport.session())

    app.use(flash());
  

  //MIDDLEWARE
    app.use((req,res,next) => {
      res.locals.success_msg = req.flash("success_msg")   /* res.locals é uma forma de criar varáveis globais dentro do projeto*/
      res.locals.error_msg = req.flash("error_msg")
      res.locals.error = req.flash("error")               // Essa é para controlar as mensagens de autenticação
      res.locals.user = req.user || null;

      next()
    });


  //Body Parser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());


  //Handlebars
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');


  //Mongoose
    mongoose.set("strictQuery", true);
    mongoose.Promise = global.Promise;  // O mano não falou exatamente pra que é isso no curso, disse que é só pra evitar alguns erros bestas.
    mongoose.connect('mongodb://127.0.0.1/nodeblog').then(()=>{console.log("conectou")}).catch((erro)=>{console.log("deu merda: " + erro)})


  //Public
    app.use(express.static(path.join(__dirname, "public")));  // Essa linha de código está indicado para o express onde fica a pasta que está guardado os arquivos estáticos desse projeto, que no caso é na pasta "public"


// Rotas
  app.get('/', (req,res) =>{ 
    Posts.find().populate("categori").sort({data: "desc"}).then(posts =>{
      res.render("index", {posts: posts.map(result => result.toJSON())})
    }).catch(err => {
      req.flash("error_msg", "Deu caca se vira ai")
      res.redirect("/404")
    })

  })

  app.get("/posts/:slug", (req,res) => {
    Posts.findOne({slug: req.params.slug}).lean()
    .then(post => {

      if(post){

        res.render("posts/index", {post: post})

      }else{

        req.flash("error_msg", "Deu caga se vira ai")
        res.redirect("/")

      }
      
    }).catch(err => {
      req.flash("error_msg", "Deu caga se vira ai")
      res.redirect("/404")
    })

    
  })


  app.get("/categories", (req,res) => {
    Categori.find().lean().then(categories =>{
      res.render("categories/index", {categories:categories})

    }).catch(err => {
      req.flash("error_msg", "Deu caca se vira ai")
      res.redirect("/404")
      console.log(err)
    })
  })

  app.get("/categories/:slug", (req,res) => {
    Categori.findOne({slug: req.params.slug}).then(categori => {

      if(categori){

          Posts.find({categori: categori._id}).lean().then(posts => {

            res.render("categories/posts", {posts:posts, categori:categori})

          }).catch(err => {
            req.flash("error_msg", "Deu caca se vira ai")
            res.redirect("/")
            console.log(err)
          })

      }else{
        req.flash("error_msg", "Deu caca se vira ai")
      res.redirect("/")
      console.log(err)
      }

    }).catch(err =>{
      req.flash("error_msg", "Deu caca se vira ai")
      res.redirect("/")
      console.log(err)
    })
  })




  app.get("/404",(req,res) => {
      res.send("<h1> Erro 404! </h1>")
  } )


  app.use('/admin', admin);
  app.use('/user', users);




// Outros
const PORT = 8081;
app.listen(PORT, ()=>{console.log("Servidor rodando!")})


