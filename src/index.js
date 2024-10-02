import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from "express";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));

app.use(express.json({ limit: "20kb" }));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("publilc"));

app.use(cookieParser());



connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`⚙️  server is runnig at port ${PORT}`);
        })
    })
    .catch((err) => {
        console.log("MONGO DB CONNECTION FAILED !!!");
    });


// Routes
import authRouter from './routes/auth.routes.js'
import taskRouter from './routes/task.routes.js'
import userRouter from './routes/user.routes.js'

// routes declaration 
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/task', taskRouter);
app.use('/api/v1/user', userRouter);

app.get('/', (req, res) => {
    res.send("test")
})