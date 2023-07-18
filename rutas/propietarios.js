const express = require("express");
const router = express.Router();
const db = require("../database/sequelize-model");
const { Op, ValidationError, fn, col } = require("sequelize");
const auth = require("../seguridad/auth");

router.get(
  "/api/propietarios",
  auth.authenticateJWT,
  async function (req, res, next) {
    const { usuario } = res.locals.user;
    if (usuario !== "admin") {
      return res.status(403).json({ message: "usuario no autorizado!" });
    }
    let data = await db.propietarios.findAll({
      attributes: ["id", "Nombre", "Apellido", "Activo", "Email", "Telefono"], /// formatear fechas
    });
    res.json(data);
  }
);

router.get(
  "/api/propietarios/:id",
  auth.authenticateJWT,
  async function (req, res, next) {
    const { usuario } = res.locals.user;
    if (usuario !== "admin") {
      return res.status(403).json({ message: "usuario no autorizado!" });
    }
    let items = await db.propietarios.findOne({
      attributes: ["id", "Nombre", "Apellido", "Activo"],
      where: { id: req.params.id },
    });
    res.status(200).json(items);
  }
);

router.post(
  "/api/propietarios",
  auth.authenticateJWT,
  async (req, res, next) => {
    const { usuario } = res.locals.user;
    if (usuario !== "admin") {
      return res.status(403).json({ message: "usuario no autorizado!" });
    }
    try {
      let data = await db.propietarios.create({
        Nombre: req.body.Nombre,
        Apellido: req.body.Apellido,
        Email: req.body.Email,
        Telefono: req.body.Telefono,
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
  "/api/propietarios/:id",
  auth.authenticateJWT,
  async (req, res, next) => {
    try {
      let item = await db.propietarios.findOne({
        attributes: ["id", "Nombre", "Apellido", "Activo", "Email", "Telefono"],
        where: { id: req.params.id },
      });
      if (!item) {
        res.status(404).json({ message: "propietario no encontrado" });
        return;
      }
      item.id = req.body.id;
      item.Nombre = req.body.Nombre;
      item.Apellido = req.body.Apellido;
      item.Activo = req.body.Activo;
      (item.Email = req.body.Email), (item.Telefono = req.body.Telefono);
      await item.save();
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
  "/api/propietarios/:id",
  auth.authenticateJWT,
  async (req, res, next) => {
    let bajaFisica = false;
    const { usuario } = res.locals.user;
    if (usuario !== "admin") {
      return res.status(403).json({ message: "usuario no autorizado!" });
    }
    if (bajaFisica) {
      // baja fisica
      let filasBorradas = await db.propietarios.destroy({
        where: { id: req.params.id },
      });
      if (filasBorradas == 1) res.sendStatus(200);
      else res.sendStatus(404);
    } else {
      // baja logica
      try {
        let data = await db.sequelize.query(
          "UPDATE Propietarios SET Activo = case when Activo = 1 then 0 else 1 end WHERE id = :id",
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
