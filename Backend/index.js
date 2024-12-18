import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from 'mongoose'
import { Book } from './models/bookModel.js';

const app = express();  // create a web server using express

app.use(express.json());

app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send("Welcome")
});

// Route for saving a new book
app.post('/books', async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) {
            return reponse.status(400).send({
                message: 'Send all required fields: title, author, publishYear', 
            });
        }
        const newBook = {
            title: request.body.title, 
            author: request.body.author,
            publishYear: request.body.publishYear,
        };
        const book = await Book.create(newBook)
        return response.status(201).send(book);

    } catch (error) {
        console.log(error.message)
        response.status(500).send({ message: error.message })
    }
});  // post method is used to create a new resource

// Route for getting all books from database
app.get('/books', async (request, response) => {
    try {
        const books = await Book.find({});
        return response.status(200).json({
            count: books.length,
            data: books
        });

    } catch(error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for getting one book from database by id
app.get('/books/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const book = await Book.findbyId(id);
        return response.status(200).json(book);

    } catch(error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});


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