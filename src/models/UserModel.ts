import { DataTypes } from "sequelize";
import { sequelize } from "../db/connection";

const UserModel = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false, 
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatarURI: {
            type: DataTypes.STRING
        }
    },
);

export default UserModel;