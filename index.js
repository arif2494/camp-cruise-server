const express = require('express');
const cors = require('cors');
const app = express();
// mongo db import
const { MongoClient } = require('mongodb');
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
		// get all the camps data
		app.get('/camps', async (req, res) => {
			const result = await campsCollection.find({});
			const camps = await result.toArray();
			res.json(camps);
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
