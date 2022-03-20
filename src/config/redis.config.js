const redis=require('redis');
const client=redis.createClient({port:process.env.REDIS||6379});

const connect=async()=>
{
	return client.connect();
};

const set_fee=async(fees)=>
{
	return client.set('fees', fees);
};

const get_fee=async()=>
{
	return client.get('fees');
};

module.exports={connect, set_fee, get_fee};