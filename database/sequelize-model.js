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
            allowNull: false,
        },
        
        createdAt: {
          type: DataTypes.DATE,
          allowNull: true
        },

        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true
        }
    }
)

module.exports = {
    sequelize,
    propietarios
}