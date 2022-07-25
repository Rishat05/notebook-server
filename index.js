const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zgbvl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const notesCollection = client.db('myNote').collection('notes');

        app.get('/notes', async (req, res) => {
            const query = req.query;
            console.log('geting');
            const cursor = notesCollection.find(query);
            const notes = await cursor.toArray();
            res.send(notes);
        });

        app.post('/note', async (req, res) => {
            const query = req.body;
            const result = await notesCollection.insertOne(query);
            res.send(result);
        });

        app.put("/note/:id", async (req, res) => {
            const id = req.params.id;
            const data = req.body;

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    userName: data.userName,
                    textData: data.textData,
                },
            };

            const result = await notesCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        app.delete("/note/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await notesCollection.deleteOne(filter);
            res.send(result);
        });
    }
    catch {

    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running my notes');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})
