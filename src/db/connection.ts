import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME as string, 
    process.env.DB_USER as string, 
    process.env.DB_PASSWORD as string, 
    {
        host: process.env.DB_HOST,
        dialect: 'postgres' 
    }
);

export const connectToDB = async() => {
    try{
        await sequelize.authenticate();
        console.log("Connection to Database successful");
    }catch(err) {
        console.error('Database connection error');
        throw err;
    }
}