// A jwt authentication server


const express = require('express')
const {Sequelize, Op, Model, DataTypes} = require('sequelize');
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()

const sequelize = new Sequelize('blogdb', 'root', 'password',{
    host: 'db',
    dialect: 'mysql'
});

class User extends Model {}
User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { sequelize });


const app = express();


app.use(bodyparser.json());


app.post('/api/auth/signup', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    const id = user.getDataValue('id');
    const token = jwt.sign(id, process.env.JWT_KEY, {expiresIn: "1h"});
    res.status(201).end(token);
})
app.listen(9090)



(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({force: true});
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
})();