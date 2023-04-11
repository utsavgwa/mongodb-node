// whole entirety of writing mongo queries fro node.js

const express = require ('express');
const {MongoClient}= require('mongodb');

// get passed down from the env. file, instead of hard coding it
const connectionString = "mongodb://localhost:27017";

async function init(){
    const client = new MongoClient(connectionString,{
        useUnifiedTopology:true
    });

    await client.connect();

    const app = express();

    app.get('/get', async(req, res)=> {
        const db = await client.db("test");
        const collection = db.collection('pets');

        const pets = await collection.find({
            $text: {$search: req.query.search}
        },
        {_id:0}
        )
        .sort({score: {$meta:"textScore"}})
        .limit(10)
        .toArray();
        
        // here, .end sends back the API response from get
        res.json({status: "ok", pets:pets}).end();
    })
    const PORT = 3000;
    app.use(express.static('./static'))
    app.listen(PORT);
    console.log(`running on http://localhost:${PORT}`)
}
init();