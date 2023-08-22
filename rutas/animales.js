const express = require("express");
const router = express.Router();
const db = require("../database/sequelize-model");
const { Op, ValidationError, Sequelize } = require("sequelize");
const auth = require("../seguridad/auth");

router.get(
  "/api/animales",
  auth.authenticateJWT,
  async function (req, res, next) {
    const { usuario } = res.locals.user;
    if (usuario !== process.env.USUARIO) {
      return res.status(403).json({ message: "usuario no autorizado!" });
    }

    let where = {};
    if (req.query.Nombre != undefined && req.query.Nombre !== "") {
      where.Nombre = {
        [Op.like]: "%" + req.query.Nombre + "%",
      };
    }

    const Pagina = req.query.Pagina ?? 1;
    const TamañoPagina = 10;
    const { count, rows} = await db.animales.findAndCountAll({
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
        "Propietarios_id",
      ],
      order: [["Nombre", "ASC"]],
      where,
      offset: (Pagina - 1) * TamañoPagina,
      limit: TamañoPagina,
    });
    res.json({ Items: rows, RegistrosTotal: count});

  }
);

router.get(
  "/api/animales/:id",
  auth.authenticateJWT,
  async function (req, res, next) {
    const { usuario } = res.locals.user;
    if (usuario !== process.env.USUARIO) {
      return res.status(403).json({ message: "usuario no autorizado!" });
    }

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
        "Propietarios_id",
      ],
      where: { id: req.params.id },
    });
    res.status(200).json(items);
  }
);

router.get("/api/animalysupropietario/:id", async function (req, res) {
  const id = req.params.id;
  let item = await db.sequelize.query(
    `SELECT A.Nombre AS AnimalNombre, A.id AS AnimalID, P.Nombre AS PropietarioNombre, P.id AS PropietarioID 
    FROM Animales A JOIN Propietarios P ON A.Propietarios_id = P.id WHERE A.id = :id`, // : es un marcador de posicion
    {
      replacements: { id: id },
      type: db.sequelize.QueryTypes.SELECT,
    }
  );
  res.status(200).json(item);
});

router.post("/api/animales", auth.authenticateJWT, async (req, res, next) => {
  const { usuario } = res.locals.user;
  if (usuario !== process.env.USUARIO) {
    return res.status(403).json({ message: "usuario no autorizado!" });
  }
  try {
    let data = await db.animales.create({
      Nombre: req.body.Nombre,
      Peso: req.body.Peso,
      Especie: req.body.Especie,
      Esterilizado: req.body.Esterilizado,
      FechaNacimiento: req.body.FechaNacimiento,
      Foto: req.body.Foto,
      Sexo: req.body.Sexo,
      Propietarios_id: req.body.Propietarios_id,
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

router.put(
  "/api/animales/:id",
  auth.authenticateJWT,
  async (req, res, next) => {
    const { usuario } = res.locals.user;
    if (usuario !== process.env.USUARIO) {
      return res.status(403).json({ message: "usuario no autorizado!" });
    }
    try {
      let item = await db.animales.update(
        {
          Nombre: req.body.Nombre,
          Peso: req.body.Peso,
          Especie: req.body.Especie,
          Esterilizado: req.body.Esterilizado,
          iFechaNacimiento: req.body.FechaNacimiento,
          Foto: req.body.Foto,
          Sexo: req.body.Sexo,
          Propietarios_id: req.body.Propietarios_id,
        },

        {
          where: { id: req.params.id },
        }
      );
      if (!item) {
        res.status(404).json({ message: "Animal no encontrado" });
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
  "/api/animales/:id",
  auth.authenticateJWT,
  async (req, res, next) => {
    let bajaFisica = false;
    const { usuario } = res.locals.user;
    if (usuario !== process.env.USUARIO) {
      return res.status(403).json({ message: "usuario no autorizado!" });
    }
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
  }
);

module.exports = router;
