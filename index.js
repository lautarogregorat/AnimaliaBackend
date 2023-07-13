const express = require('express');
const connectDB = require('./database/connect')
connectDB()
const app = express()
app.use(express.json())

const propietarios = require('./rutas/propietarios')
app.use(propietarios)

const animales = require('./rutas/animales')
app.use(animales)

app.listen(3000, () => {console.log('hola mundo')})
