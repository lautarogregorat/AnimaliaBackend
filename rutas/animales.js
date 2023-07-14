const express = require("express");
const router = express.Router();
const db = require('../database/sequelize-model')
const { Op, ValidationError, Sequelize} = require("sequelize");


router.get('/api/animales', async function (req, res) {
    let data = await db.animales.findAll(
        {
            attributes: ["id", 
            "Nombre", 
            "Peso",
            "Especie",
            "Esterilizado",
            "FechaNacimiento",
            "Foto",
            "Activo",
            "Sexo",
            "Propietarios_id"
        ]
        }
    )
    res.json(data)
})

router.get("/api/animales/:id", async function (req, res) {
  let items = await db.animales.findOne({
    attributes: [
        "id", 
        "Nombre", 
        "Peso",
        "Especie",
        "Esterilizado",
        "FechaNacimiento",
        "Foto",
        "Activo",
        "Sexo",
        "Propietarios_id"
    ],
    where: { id: req.params.id },
  });
  res.status(200).json(items);
});

router.get("/api/animalysupropietario/:id", async function (req, res) {
  const id = req.params.id
  let item = await db.sequelize.query(
    `SELECT A.Nombre AS AnimalNombre, A.id AS AnimalID, P.Nombre AS PropietarioNombre, P.id AS PropietarioID 
    FROM Animales A JOIN Propietarios P ON A.Propietarios_id = P.id WHERE A.id = :id`, // : es un marcador de posicion
    {
      replacements: { id: id },
      type: db.sequelize.QueryTypes.SELECT
    }
  );
  res.status(200).json(item)
});



router.post('/api/animales', async (req, res) => {
    try {
        let data = await db.animales.create({
            id: req.body.id,
            Nombre: req.body.Nombre,
            Peso: req.body.Peso,
            Especie: req.body.Especie,
            Esterilizado: req.body.Esterilizado,
            FechaNacimiento: req.body.FechaNacimiento,
            Foto: req.body.Foto,
            Sexo: req.body.Sexo,
            Propietarios_id: req.body.Propietarios_id
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

router.put('/api/animales/:id', async (req, res) => {
  try {
    let item = await db.animales.findOne({
      attributes: [
        "id",
        "Nombre", 
        "Peso",
        "Especie",
        "Esterilizado",
        "FechaNacimiento",
        "Foto",
        "Activo",
        "Sexo",
        "Propietarios_id"
      ],
      where: { id: req.params.id },
    });
    if (!item) {
      res.status(404).json({ message: "Animal no encontrado" });
      return;
    }
    item.id = req.body.id
    item.Nombre = req.body.Nombre,
    item.Peso =  req.body.Peso,
    item.Especie =  req.body.Especie,
    item.Esterilizado = req.body.Esterilizado,
    item.FechaNacimiento =  req.body.FechaNacimiento,
    item.Foto =  req.body.Foto,
    item.Sexo = req.body.Sexo,
    item.Propietarios_id = req.body.Propietarios_id
    await item.save();
    res.sendStatus(200);
  } catch (err) {
    if (err instanceof ValidationError) {
      // si son errores de validacion, los devolvemos
      let messages = '';
      err.errors.forEach((x) => messages += x.path + ": " + x.message + '\n');
      res.status(400).json({message : messages});
    } else {
      // si son errores desconocidos, los dejamos que los controle el middleware de errores
      throw err;
    }
  }
})


router.delete("/api/animales/:id", async (req, res) => {
  let bajaFisica = false;

  if (bajaFisica) {
    // baja fisica
    let filasBorradas = await db.animales.destroy({
      where: { id: req.params.id },
    });
    if (filasBorradas == 1) res.sendStatus(200);
    else res.sendStatus(404);
  } else {
    // baja logica
    try {
      let data = await db.sequelize.query(
        "UPDATE Animales SET Activo = case when Activo = 1 then 0 else 1 end WHERE id = :id",
        {
          replacements: { id: +req.params.id },
        }
      );
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof ValidationError) {
        // si son errores de validacion, los devolvemos
        const messages = err.errors.map((x) => x.message);
        res.status(400).json(messages);
      } else {
        // si son errores desconocidos, los dejamos que los controle el middleware de errores
        throw err;
      }
    }
  }
});



module.exports = router;