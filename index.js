const express = require("express");
require("dotenv").config();
const mysql = require("mysql2");
const connection = mysql.createConnection(process.env.DATABASE_URL);
const cors = require("cors");
const app = express();

app.use (cors({origin:"*"}))
const cookieParser = require("cookie-parser")
app.use(cookieParser())
app.use(express.text()); // entiende texto
app.use(express.urlencoded({ extended: false })); 

app.use(express.json());

const propietarios = require("./rutas/propietarios");
app.use(propietarios);

const animales = require("./rutas/animales");
app.use(animales);

const controles = require("./rutas/controles");
app.use(controles);

const seguridad = require("./rutas/seguridad");
app.use(seguridad);

const detallesControl = require("./rutas/detallecontroles");
app.use(detallesControl);


app.listen(process.env.PORT, () => {
});
