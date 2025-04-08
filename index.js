require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB has been connected"))
    .catch(err => console.error("Error connecting to MongoDB:", err));


const authRoutes = require('./Routes/AuthRoutes');
app.use('/api', authRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is listening on ${port}!`))