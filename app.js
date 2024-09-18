const express = require("express");
const app = express();
const port = 3000;
const session = require("express-session");
// const FileStore = require("session-file-store")(session); //só pra guardar

app.use(express.static("app/public"));

app.use(session({
  // store: new FileStore(),
  secret: 'Froez777',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false }
}))

app.set("view engine", "ejs");
app.set("views", "./app/views");

// variaveis globais

// app.use((req, res, next) => {
//   res.locals.Clienteid = req.session.Clienteid;
//   next();
// });

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

var rotas = require("./app/routes/router");
app.use("/", rotas);

app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}\nhttp://localhost:${port}`);
});
