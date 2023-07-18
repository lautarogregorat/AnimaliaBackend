const express = require("express");
const db = require("../database/sequelize-model");
const router = express.Router();
const { Op, ValidationError, fn, col } = require("sequelize");
const auth = require("../seguridad/auth");

router.get(
  "/api/controles",
  auth.authenticateJWT,
  async function (req, res, next) {
    const { usuario } = res.locals.user;
    if (usuario !== "admin") {
      return res.status(403).json({ message: "usuario no autorizado!" });
    }
    let data = await db.controles.findAll({
      attributes: ["id", "Descripcion", "Fecha", "Animales_id", "Activo"],
    });
    res.json(data);
  }
);

router.get(
  "/api/controles/:id",
  auth.authenticateJWT,
  async function (req, res, next) {
    const { usuario } = res.locals.user;
    if (usuario !== "admin") {
      return res.status(403).json({ message: "usuario no autorizado!" });
    }
    let data = await db.controles.findAll({
      attributes: ["id", "Descripcion", "Fecha", "Animales_id", "Activo"],
      where: { id: req.params.id },
    });
    res.status(200).json(data);
  }
);

router.post(
  "/api/controles",
  auth.authenticateJWT,
  async function (req, res, next) {
    const { usuario } = res.locals.user;
    if (usuario !== "admin") {
      return res.status(403).json({ message: "usuario no autorizado!" });
    }
    try {
      let data = await db.controles.create({
        Descripcion: req.body.Descripcion,
        Fecha: req.body.Fecha,
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
  }
);

router.put(
  "/api/controles/:id",
  auth.authenticateJWT,
  async (req, res, next) => {
    try {
      let item = await db.controles.update(
        {
          Descripcion: req.body.Descripcion,
          Fecha: req.body.Fecha,
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
        err.errors.forEach(
          (x) => (messages += x.path + ": " + x.message + "\n")
        );
        res.status(400).json({ message: messages });
      } else {
        // si son errores desconocidos, los dejamos que los controle el middleware de errores
        throw err;
      }
    }
  }
);

router.delete(
  "/api/controles/:id",
  auth.authenticateJWT,
  async (req, res, next) => {
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
  }
);

module.exports = router;
