const express = require('express');
const app = express();

const {fees,compute_transaction_fee}=require('./src/controller/fee.controller');

app.use(express.json());

app.post('/fees', fees);

app.post('/compute-transaction-fee', compute_transaction_fee);

module.exports={app};