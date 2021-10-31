const express = require('express');
const cors = require('cors');
const app = express();
// mongo db import
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
// env config
require('dotenv').config();
const port = process.env.PORT || 5000;
// middlewear
app.use(cors());
app.use(express.json());

// mongo db uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env
	.DB_PASS}@firstcluster.fhu8f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// mongo db
async function run() {
	try {
		await client.connect();
		const database = client.db('campCruise');
		const campsCollection = database.collection('camps');
		const ordersCollection = database.collection('orders');
		// get all the camps data
		app.get('/camps', async (req, res) => {
			const result = await campsCollection.find({});
			const camps = await result.toArray();
			res.json(camps);
		});
		// get a single camp data
		app.post('/camp', async (req, res) => {
			const campId = req.body.id.id;
			const query = { _id: ObjectId(campId) };
			const result = await campsCollection.findOne(query);
			res.json(result);
		});
		// save all orders
		app.post('/orders', async (req, res) => {
			const order = req.body;
			const result = await ordersCollection.insertOne(order);
			res.json(result);
		});
		// find orders for specefic user
		app.post('/myorder', async (req, res) => {
			const userEmail = req.body.userEmail;
			const query = { email: userEmail };
			const cursor = await ordersCollection.find(query);
			const result = await cursor.toArray();
			res.json(result);
		});

		// cancel an order
		app.delete('/cancel/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await ordersCollection.deleteOne(query);
			res.json(result);
		});
		// get all order
		app.get('/allorders', async (req, res) => {
			const result = await ordersCollection.find({});
			const orders = await result.toArray();
			res.json(orders);
		});
		// update order status
		app.put('/status/:id', async (req, res) => {
			const id = req.params.id;
			const filter = { _id: ObjectId(id) };
			const updateDoc = {
				$set: {
					status: 'Approved'
				}
			};
			const result = await ordersCollection.updateOne(filter, updateDoc);
			res.json(result);
		});
		// set a camp data
		app.post('/newcamp', async (req, res) => {
			const doc = req.body;
			const result = await campsCollection.insertOne(doc);
			res.json(result);
		});
	} finally {
		// await client.close()
	}
}
run().catch(console.dir);

app.get('/', (req, res) => {
	res.send('server is up');
});

app.listen(port, () => {
	console.log('server is running at port ', port);
});
