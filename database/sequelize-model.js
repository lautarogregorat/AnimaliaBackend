const {Sequelize, DataTypes} = require('sequelize')
const pg = require('pg');



// Establece el objeto SSL con la opción 'rejectUnauthorized' adecuada
pg.defaults.ssl = {
  rejectUnauthorized: true
};

const sequelize = new Sequelize('mysql://dw9ekho67powef39vf3x:pscale_pw_WosZ9TGzsJZRcuxLNBd4kHKffVf3tjjVWEVbeFEjBgK@aws.connect.psdb.cloud/animalia', {
  dialectOptions: {
    ssl: {
      rejectUnauthorized: true
    }
  }
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
            allowNull: false
        },
        Apellido: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        
        Activo: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },

        Email: {
          type: DataTypes.STRING,
          allowNull:true
        },
        
        Telefono: {
          type: DataTypes.STRING,
          allowNull: true,
        }

    },
    {
      sequelize,
      timestamps: true
    }
)


const animales = sequelize.define(
  'Animales',
  {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  Nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },

  Peso: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: true
  },
  Especie: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  Esterilizado: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  FechaNacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  Foto: {
    type: DataTypes.BLOB('long'),
    allowNull: true
  },
  Activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 1
  },
  Sexo: {
    type: DataTypes.STRING,
    allowNull: true,
  }
},
  {hooks: {
    beforeValidate: function (animales, options) {
    if (typeof animales.Nombre === "string") {
        animales.Nombre = animales.Nombre.toUpperCase().trim();
          }
        },
    },
  timestamps: false,
});


module.exports = {
    sequelize,
    propietarios,
    animales
}