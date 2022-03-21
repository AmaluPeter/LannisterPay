require('dotenv').config();
const {PORT}=process.env||'8000';
const {connect}=require('./src/config/redis.config');
const {app}=require('./app');

app.listen(PORT,  async ()=> {
	await connect();
	await console.log(`LannisterPay listening on port:${PORT}`);
});
