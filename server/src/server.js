const express = require('express');
const bodyParser = require("body-parser");
const mongo = require('mongodb');

const app = express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

const withDb = async (operations, res) => {
  try {
    const client = await mongo.MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser: true});
    const db = client.db("data");

    await operations(db);
  
    client.close();
  } catch (error) {
    res.status(error.status).json({message: "Something went wrong", error});
  }
};

app.get("/api/data/:name", async (req, res) => {
  withDb(async (db) => {
    const name = req.params.name.toLowerCase();

    const data = await db.collection('items').findOne({name});

    res.status(200).json(data);
  }, res);
});

app.get("/api/data/:name/upvote", async (req, res) => {
  withDb(async (db) => {
    const name = req.params.name.toLowerCase();

    const data = await db.collection('items').findOne({name});
    await db.collection('items').updateOne({name}, {
      '$set': {
        upvotes: data.upvotes + 1,
      }
    });

    const updatedData = await db.collection('items').findOne({name});
    res.status(200).json(updatedData);
  }, res);
});

app.post("/api/data/:name/add-comment", (req, res) => {
  const {username, text} = req.body;
  const name = req.params.name.toLowerCase();
  withDb(async (db) => {
    const data = await db.collection('items').findOne({name});
    await db.collection('items').updateOne({name}, {
      '$set': {
        comments: data.comments.concat({username, text}),
      }
    });
    const updatedData = await db.collection('items').findOne({name});
    res.status(200).json(updatedData);
  }, res);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 app listening on http://localhost:${port}`);
});
