const express = require("express");
const db = require("../database/sequelize-model");
const router = express.Router();
const { Op, ValidationError, fn, col } = require("sequelize");

router.get("/api/controles", async function (req, res) {
  let data = await db.controles.findAll({
    attributes: [
      "id",
      "Examen",
      "FechaExamen",
      "Tratamiento",
      "FechaTratamiento",
      "Foto",
      "MotivoConsulta",
      "Anamnesis",
      "Resenia",
      "Animales_id",
      "Activo",
    ],
  });
  res.json(data);
});

router.get("/api/controles/:id", async function (req, res) {
  let data = await db.controles.findAll({
    attributes: [
      "id",
      "Examen",
      "FechaExamen",
      "Tratamiento",
      "FechaTratamiento",
      "Foto",
      "MotivoConsulta",
      "Anamnesis",
      "Resenia",
      "Animales_id",
      "Activo",
    ],
    where: { id: req.params.id },
  });
  res.status(200).json(data);
});

router.post("/api/controles", async function (req, res) {
  try {
    let data = await db.controles.create({
      Examen: req.body.Examen,
      FechaExamen: req.body.FechaExamen,
      Tratamiento: req.body.Tratamiento,
      FechaTratamiento: req.body.FechaTratamiento,
      Foto: req.body.Foto,
      MotivoConsulta: req.body.MotivoConsulta,
      Anamnesis: req.body.Anamnesis,
      Resenia: req.body.Resenia,
      Animales_id: req.body.Animales_id,
      Activo: req.body.Activo,
    });
    res.status(200).json(data.dataValues); // devolvemos el registro agregado!
  } catch (err) {
    if (err instanceof ValidationError) {
      // si son errores de validacion, los devolvemos
      let messages = "";
      err.errors.forEach(
        (x) => (messages += (x.path ?? "campo") + ": " + x.message + "\n")
      );
      res.status(400).json({ message: messages });
    } else {
      // si son errores desconocidos, los dejamos que los controle el middleware de errores
      throw err;
    }
  }
});

router.put("/api/controles/:id", async (req, res) => {
  try {
    let item = await db.controles.update(
      {
        Examen: req.body.Examen,
        FechaExamen: req.body.FechaExamen,
        Tratamiento: req.body.Tratamiento,
        FechaTratamiento: req.body.FechaTratamiento,
        Foto: req.body.Foto,
        MotivoConsulta: req.body.MotivoConsulta,
        Anamnesis: req.body.Anamnesis,
        Resenia: req.body.Resenia,
        Animales_id: req.body.Animales_id,
        Activo: req.body.Activo,
      },

      {
        where: { id: req.params.id },
      }
    );
    if (!item) {
      res.status(404).json({ message: "Control no encontrado" });
      return;
    }
    res.sendStatus(200);
  } catch (err) {
    if (err instanceof ValidationError) {
      // si son errores de validacion, los devolvemos
      let messages = "";
      err.errors.forEach((x) => (messages += x.path + ": " + x.message + "\n"));
      res.status(400).json({ message: messages });
    } else {
      // si son errores desconocidos, los dejamos que los controle el middleware de errores
      throw err;
    }
  }
});

router.delete("/api/controles/:id", async (req, res) => {
  let bajaFisica = false;

  if (bajaFisica) {
    // baja fisica
    let filasBorradas = await db.controles.destroy({
      where: { id: req.params.id },
    });
    if (filasBorradas == 1) res.sendStatus(200);
    else res.sendStatus(404);
  } else {
    // baja logica
    try {
      let data = await db.sequelize.query(
        "UPDATE Controles SET Activo = case when Activo = 1 then 0 else 1 end WHERE id = :id",
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
