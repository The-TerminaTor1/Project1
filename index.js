require('dotenv').config()

 const express = require('express');
 const mongoose = require('mongoose');

 const app = express();

app.use(express.json());

console.log(" MONGO_URI:", process.env.MONGO_URI);
console.log(" JWT_SECRET:", process.env.JWT_SECRET);
console.log(" EMAIL_USER:", process.env.EMAIL_USER);
console.log(" EMAIL_PASS:", process.env.EMAIL_PASS);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB has been connected"))
.catch(err => console.error("Error connecting to MongoDB:", err));


const port = 3000
app.get('/', (req, res) => {res.send('Running')});

app.listen(port, () => console.log(`Server is listening on ${port}!`))