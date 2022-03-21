const request=require('supertest');
const {app}=require('../app');
const {connect, disconnect}=require('../src/config/redis.config');

describe('Test Lannister Pay',()=>{
	beforeAll(async ()=>{
		await connect();
	});

	afterAll(async ()=>{
		await disconnect();
	});

	test('POST /fees',()=>{
		request(app)
			.post('/fees')
			.send(
				{
					FeeConfigurationSpec: 'LNPY1221 NGN * *(*) : APPLY PERC 1.4',
				}
			)
			.expect(200);
	});

	test('POST /compute-transaction-fee',()=>{
		request(app)
			.post('/compute-transaction-fee')
			.send(
				{
					ID: 91203,
					Amount: 5000,
					Currency: 'NGN',
					CurrencyCountry: 'NG',
					Customer: {
						ID: 2211232,
						EmailAddress: 'anonimized29900@anon.io',
						FullName: 'Abel Eden',
						BearsFee: true
					},
					PaymentEntity: {
						ID: 2203454,
						Issuer: 'GTBANK',
						Brand: 'MASTERCARD',
						Number: '530191******2903',
						SixID: '530191',
						Type: 'CREDIT-CARD',
						Country: 'NG'
					},
				}
			)
			.expect(200);
	});
});