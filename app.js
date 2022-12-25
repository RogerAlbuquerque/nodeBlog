// Carregando módulos
  const express    = require('express');
  const handlebars = require('express-handlebars');
  const bodyParser = require('body-parser');
  const app        = express();
  const admin      = require('./routes/admin');
  const path       = require('path');
  const mongoose   = require('mongoose') ;


// Configurações
  //Body Parser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

  //Handlebars
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');

  //Mongoose
    mongoose.set("strictQuery", true);
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://127.0.0.1/nodeblog').then(()=>{console.log("conectou")}).catch((erro)=>{console.log("deu merda: " + erro)})

  //Public
    app.use(express.static(path.join(__dirname, "public")));  // Essa linha de código está indicado para o express onde fica a pasta que está guardado os arquivos estáticos desse projeto, que no caso é na pasta "public"


// Rotas
  app.use('/admin', admin);




// Outros
const PORT = 8081;
app.listen(PORT, ()=>{console.log("Servidor rodando!")})


