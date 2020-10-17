import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import userRouter from './controllers/UserController.js';
import kasirRouter from './controllers/KasirController.js';

const app = express();


//connect to db
mongoose.connect(process.env.MONGODB_URI, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
},
() => {
    console.log('Connect to DB success');
})
    
//Middlewares
app.use(morgan('dev'));
app.use(express.json());

//routes
app.get('/', (req, res)=> {
    res.json({
        message: 'success',
    })
})

app.use('/api/user', userRouter);
app.use('/api/kasir', kasirRouter);

const PORT = process.env.port || '4000';

app.listen(PORT, () => {
    console.log(`App listens to port ${PORT}`)
})