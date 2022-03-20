const {set_fee, get_fee}=require('../config/redis.config');
const {fee_validator, compute_validator}=require('../util/validator');
const{currency,locale, entity, entity_properties}=require('../service/compute.service');

const fees= async(req, res)=> {
	try
	{
		const {FeeConfigurationSpec}=req.body;
		if(!FeeConfigurationSpec)
			return res.status(500).json({error:'invalid fee configuration'});
		const feeStrings=FeeConfigurationSpec.split('\n');
		const feeArray=[];
		let i = 0,
			len = feeStrings.length;
		while (i < len) {
			const feeString = feeStrings[i].split(' ');
			const item={
				fee_id: feeString[0],
				fee_currency: feeString[1],
				fee_locale: feeString[2],
				fee_entity: feeString[3].substr(0, feeString[3].indexOf('(')),
				entity_property: feeString[3].split('(').pop().split(')')[0],
				fee_type: feeString[6],
				fee_value: feeString[7],
			};
			const validate=fee_validator.validate(item);
			if(validate.error)
				return res.status(500).json({error:validate.error.details[0].message});
			else
				feeArray.push(item);
			i++;
		}
		await set_fee(JSON.stringify(feeArray));
		res.json({ status: 'ok' });
	}
	catch(e)
	{
		console.log(e);
		res.status(500).json({error:'an error occurred'});
	}
};

const compute_transaction_fee= async(req, res)=> {
	try
	{
		const validate=compute_validator.validate(req,{allowUnknown:true});
		if(validate.error)
			return res.status(500).json({error:validate.error.details[0].message});
		let fees= JSON.parse(await get_fee());
		const {body}=req;

		if(body.Currency)
			fees=await currency(body.Currency,fees);
		if(fees.length===0)
			return res.status(500).json({error:`No fee configuration for ${body.Currency}`});

		if (body.CurrencyCountry===body.PaymentEntity.Country)
			fees=await locale('LOCL',fees);
		else
			fees=await locale('INTL',fees);
		if(fees.length===0)
			return res.status(500).json({error:'No fee configuration for locale'});

		if(body.PaymentEntity.Type)
			fees=await entity(body.PaymentEntity.Type,fees);
		if(fees.length===0)
			return res.status(500).json({error:`No fee configuration for ${body.PaymentEntity.Type}`});

		const compute=await entity_properties(body.PaymentEntity, fees, body.Amount);
		if(compute.length===0)
			return res.status(500).json({error:'No fee configuration for Entity Properties'});

		let ChargeAmount = body.Amount;

		if(body.Customer.BearsFee)
			ChargeAmount+=parseInt(compute.AppliedFeeValue);

		const SettlementAmount = ChargeAmount - compute.AppliedFeeValue;
		res.json({ ...compute,ChargeAmount,SettlementAmount});
	}
	catch(e)
	{
		console.log(e);
		res.status(500).json({error:'An Error Occurred'});
	}
};

module.exports={fees,compute_transaction_fee};


