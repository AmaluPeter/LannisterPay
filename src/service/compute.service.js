const currency = async (cur, fees) => {
	let a=[];
	const b = fees.filter(
		(x) => x.fee_currency === cur
	);
	if (b.length>0)
		a=a.concat(b);
	const c=fees.filter(
		(x) => x.fee_currency === '*'
	);
	if (c.length>0)
		a=a.concat(c);
	return a;
};

const locale = async (loc, fees) => {
	let a=[];
	const b = fees.filter(
		(x) => x.fee_locale === loc
	);
	if (b.length>0)
		a=a.concat(b);
	const c=fees.filter(
		(x) => x.fee_locale === '*'
	);
	if (c.length>0)
		a=a.concat(c);
	return a;
};

const entity = async (ent, fees) => {
	let a=[];
	const b = fees.filter(
		(x) => x.fee_entity === ent
	);
	if (b.length>0)
		a=a.concat(b);
	const c=fees.filter(
		(x) => x.fee_entity === '*'
	);
	if (c.length>0)
		a=a.concat(c);
	return a;
};

const entity_properties=async(pros, fees, Amount)=>{
	if(pros.Issuer)
		fees=await property(pros.Issuer,fees);
	if(fees.length>0 && fees[0].entity_property!='*')
		return compute(fees[0] ,Amount);
	else
	{
		if(pros.Brand)
			fees=await property(pros.Brand,fees);
		if(fees.length>0 && fees[0].entity_property!='*')
			return compute(fees[0], Amount);
		else
		{
			if(pros.Number)
				fees=await property(pros.Number,fees);
			if(fees.length>0 && fees[0].entity_property!='*')
				return compute(fees[0], Amount);
			else
			{
				if(pros.SixID)
					fees=await property(pros.SixID,fees);
				if(fees.length==0)
					return null;
				else
					return compute(fees[0], Amount);
			}
		}
	}
};

const property = async (pro, fees) => {
	let a=[];
	const b = fees.filter(
		(x) => x.entity_property === pro
	);
	if (b.length>0)
		a=a.concat(b);
	const c=fees.filter(
		(x) => x.entity_property === '*'
	);
	if (c.length>0)
		a=a.concat(c);
	return a;
};

const compute=async (fees, amount)=>{
	const AppliedFeeID=fees.fee_id;
	let AppliedFeeValue;
	if(fees.fee_type==='FLAT')
		AppliedFeeValue = fees.fee_value;
	else
	if(fees.fee_type==='PERC')
		AppliedFeeValue=  (fees.fee_value*amount/100);
	else
	if(fees.fee_type==='FLAT_PERC')
	{
		const fee=fees.fee_value.split(':');
		AppliedFeeValue= parseInt(fee[0])+(fee[1]*amount/100);
	}
	return{AppliedFeeID,AppliedFeeValue};
};

module.exports = {
	currency,
	locale,
	entity,
	property,
	compute,
	entity_properties
};
