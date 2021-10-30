const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

// middlewar 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y387w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db("tourism");
        const placeCollections = database.collection("places");
        const orderCollections = database.collection("orders");

        // get all data 
        app.get('/places',async (req,res)=>{

            const cursor = placeCollections.find({});
            const places = await cursor.toArray();
            res.send(places);
        })

        // get all order 
        app.get('/orders',async (req,res)=>{

            const cursor = orderCollections.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })

        // get single place 
        app.get('/places/:id',async(req,res)=>{

            const id = req.params.id;
            const query = { _id:ObjectId(id) };
            const place = await placeCollections.findOne(query);
            res.send(place)
        })

        // post data 
        app.post('/places',async(req,res)=>{

            const newPlace = req.body;
            const result = await placeCollections.insertOne(newPlace);
            res.json(result);
        })

        //booked place
        app.post('/orders',async(req,res)=>{
            const newOrder = req.body;
            const result = await orderCollections.insertOne(newOrder);
            res.json(result);
        } )     

        // get my orders 
        app.get('/orders/:email',async (req,res)=>{  

            const result = await orderCollections.find({ email: req.params.email }).toArray();
            res.json(result);

        })

        // get single order 
        // app.get('/orders/:id',async(req,res)=>{
        //     const id = req.params.id;
        //     // const query = { _id:ObjectId(id) };
        //     // const result = await orderCollections.deleteOne(query);
        //     console.log('getting id:',id);
        //     res.json('getting')
        // })

        // delete order 
        app.delete('/orders/:id',async(req,res)=>{
            const id = req.params.id;
            const query = { _id:ObjectId(id) };
            const result = await orderCollections.deleteOne(query);
            console.log('deleting id:',result);
            res.json(result)
        })

    }
    finally{
    }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Running Tralive server')
})

app.listen(port,()=>{
    console.log('port number: ',port);
})