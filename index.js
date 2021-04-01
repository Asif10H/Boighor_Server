const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const port = process.env.PORT || 6066;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gvtvy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("boighorStore").collection("products");
    console.log('database connected');

    app.get('/products', (req, res) => {
        productCollection.find()
            .toArray((err, items) => {
                res.send(items);
            })
    })

    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        productCollection.insertOne(newProduct)
            .then(result => {
                console.log('inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })
});

app.get('/', (req, res) => {
    res.send('hello world')
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})
