const { Sequelize, DataTypes } = require("sequelize");
const pg = require("pg");
const { DataTypes } = require("sequelize");
const { DataTypes } = require("sequelize");

require("dotenv").config();

// Establece el objeto SSL con la opción 'rejectUnauthorized' adecuada
pg.defaults.ssl = {
  rejectUnauthorized: true,
};
//borrar ***
const sequelize = new Sequelize(process.env.DATABASE_SEQUELIZE, {
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true,
    },
  },
});

const propietarios = sequelize.define(
  "Propietarios",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Apellido: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    Email: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    Telefono: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeValidate: function (propietarios, options) {
        if (typeof propietarios.Nombre === "string") {
          propietarios.Nombre = propietarios.Nombre.toLowerCase().trim();
        }
        if (typeof propietarios.Apellido === "string") {
          propietarios.Apellido = propietarios.Apellido.toLowerCase().trim();
        }
      },
    },
    sequelize,
    timestamps: false,
  }
);

const animales = sequelize.define(
  "Animales",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    Nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    Peso: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: true,
    },
    Especie: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    Esterilizado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    FechaNacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Foto: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
    },
    Sexo: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    Propietarios_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeValidate: function (animales, options) {
        if (typeof animales.Nombre === "string") {
          animales.Nombre = animales.Nombre.toLowerCase().trim();
        }
        if (typeof animales.Especie === "string") {
          animales.Especie = animales.Especie.toLowerCase().trim();
        }
        if (typeof animales.Sexo === "string") {
          animales.Sexo = animales.Sexo.toLowerCase().trim();
        }
      },
    },
    timestamps: false,
    sequelize,
  }
);

const controles = sequelize.define(
  "Controles",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Fecha: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Descripcion: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },

    Animales_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Activo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1,
    },
  },

  {
    sequelize,
    timestamps: false,
  }
);

const detallesControl = sequelize.define(
  "detallesControl", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    Descripcion: {
      type: DataTypes.TEXT
    },
    Imagen: {
      type: DataTypes.BLOB,
    },
    Controles_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Tipo: {
      type: DataTypes.VARCHAR(30)
    }
  },
  {
    sequelize,
    timestamps: false
  }
);

propietarios.hasMany(animales);
animales.belongsTo(propietarios);
animales.hasMany(controles);
controles.belongsTo(animales);
detallesControl.belongsTo(controles);
controles.hasMany(detallesControl);


module.exports = {
  sequelize,
  propietarios,
  animales,
  controles,
};
