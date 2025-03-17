import express from 'express'
import cors from 'cors';
import { connectToDB, sequelize } from './db/connection';
import router from './routes/router';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/', router);

const PORT = 5050;

const startServer = async() => {
    try{
        await connectToDB();
        await sequelize.sync({force: true});
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    } catch(err) {
        console.error(err);
    }
}

startServer();