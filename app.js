require('dotenv').config();
const express = require('express');
const app = express();
const {PORT}=process.env||'8000';
const {connect}=require('./src/config/redis.config');
const {fees,compute_transaction_fee}=require('./src/controller/fee.controller');

app.use(express.json());

app.post('/fees', fees);

app.post('/compute-transaction-fee', compute_transaction_fee);

app.listen(PORT,  async ()=> {
	await connect();
	console.log(`LannisterPay listening on port:${PORT}`);
});