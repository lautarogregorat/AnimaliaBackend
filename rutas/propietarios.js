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


module.exports = router;
