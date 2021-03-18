const express = require('express');
const bodyParser = require("body-parser");
const mongo = require('mongodb');

const app = express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

const dummyProducts = [
  {
    code: '5000169372562',
    name: 'Multi Vitimins & Iron',
    brand_name: 'Waitrose',
    image_url: 'https://ecom-su-static-prod.wtrecom.com/images/products/11/LN_735954_BP_11.jpg',
  },
  {
    code: '5045092851500',
    name: 'Vitamin B Complex',
    brand_name: 'Boots',
    image_url: 'https://boots.scene7.com/is/image/Boots/10114243?id=-Klmv1&fmt=jpg&fit=constrain,1&wid=504&hei=548',
  },
  {
    code: '5028197943448',
    name: 'Hemp Hand Cream',
    brand_name: 'The Body Shop',
    image_url: 'https://media.thebodyshop.com/i/thebodyshop/HEMP_HARD-WORKING_HAND_PROTECTOR_100ML_1_INRSDPS067.jpg?$product-zoom$',
  },
  {
    code: '02093482',
    name: 'Tape Measure',
    brand_name: 'Wilko',
    image_url: 'https://www.wilko.com/assets/bWFzdGVyfGltYWdlc3w5NjU5N3xpbWFnZS9qcGVnfGltYWdlcy9oYzEvaGRmLzg4MjMzNTI4NTI1MTAuanBnfDNhMmEwODgxYjc4ZGFjNGQ3NTg2MzUwN2NmMjlmYjEyYTFkNzFjYTlkZGRkMjVkMWViNDNjMTAxZjNjMGE3Mzk=/0209348-1.jpg',
  }
];

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

app.get("/api/products/:code", (req, res) => {
  const data = dummyProducts.find(p => p.code === req.params.code); // Using fake data for now.
  res.status(200).json(data);
});

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
