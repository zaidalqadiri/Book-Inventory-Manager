import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from 'mongoose'
import { Book } from './models/bookModel.js';
import booksRoute from './routes/booksRoute.js'

const app = express();  // create a web server using express

app.use(express.json());

app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send("Welcome")
});

app.use('/books', booksRoute);

mongoose
    .connect(mongoDBURL)
    .then(() => {  // successfull connection to databsed
        console.log('APP connected to database');
        // run the express server only if the database connection is successful
        app.listen(PORT, () => {
            console.log(`App is listening to port ${PORT}`)
        });
    })

    .catch((error) => {  // used for catching errors and then printing the error
        console.log(error);
    });