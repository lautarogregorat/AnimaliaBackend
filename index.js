const express = require('express');
const connectDB = require('./database/connect')
connectDB()
const app = express()
app.use(express.json())

const propietarios = require('./rutas/propietarios')
app.use(propietarios)

app.listen(3000, () => {console.log('hola mundo')})
