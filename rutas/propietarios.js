const express = require("express");
const router = express.Router();
const db = require('../database/sequelize-model')
const { Op, ValidationError } = require("sequelize");

router.get('/api/propietarios', async function (req, res) {
    let data = await db.propietarios.findAll(
        {
            attributes: ["id", "Nombre", "Apellido"]
        }
    )
    res.json(data)
})

router.post('/api/propietarios', async (req, res) => {
    try {
        let data = await db.propietarios.create({
          Nombre: req.body.Nombre,
          Apellido: req.body.Apellido
        });
        res.status(200).json(data.dataValues); // devolvemos el registro agregado!
      } catch (err) {
        if (err instanceof ValidationError) {
          // si son errores de validacion, los devolvemos
          let messages = '';
          err.errors.forEach((x) => messages += (x.path ?? 'campo') + ": " + x.message + '\n');
          res.status(400).json({message : messages});
        } else {
          // si son errores desconocidos, los dejamos que los controle el middleware de errores
          throw err;
        }
      }
})


module.exports = router;

