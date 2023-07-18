const express = require("express");
require("dotenv").config();
const mysql = require("mysql2");
const connection = mysql.createConnection(process.env.DATABASE_URL);

const app = express();
app.use(express.json());

const propietarios = require("./rutas/propietarios");
app.use(propietarios);

const animales = require("./rutas/animales");
app.use(animales);

const controles = require("./rutas/controles");
app.use(controles);

const seguridad = require('./rutas/seguridad');
app.use(seguridad);

app.listen(3000, () => {
  console.log("hola mundo");
});
