const {Sequelize, DataTypes} = require('sequelize')
const pg = require('pg');

// Establece el objeto SSL con la opción 'rejectUnauthorized' adecuada
pg.defaults.ssl = {
  rejectUnauthorized: true
};

const sequelize = new Sequelize('mysql://8vddmvcl7mfgehm1hr90:pscale_pw_TJW3lq8HYigMSMbRBJkHeiJH6fFNnUCI3RwIeigSt2J@aws.connect.psdb.cloud/animalia', {
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
        }
    }
)

module.exports = {
    sequelize,
    propietarios
}