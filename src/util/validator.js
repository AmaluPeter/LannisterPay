const Joi=require('joi');

const fee_validator=Joi.object({
	fee_id: Joi.string().length(8).required(),
	fee_currency: Joi.string().required(),
	fee_locale: Joi.string().required(),
	fee_entity: Joi.string().required(),
	entity_property: Joi.string().required(),
	fee_type: Joi.string().valid('FLAT','PERC','FLAT_PERC').required(),
	fee_value: Joi.string().required(),
});

const compute_validator=Joi.object( {
	body:Joi.object().keys({
		Amount: Joi.number().min(0).required(),
		Currency: Joi.string().required(),
		CurrencyCountry: Joi.string().required(),
		Customer: Joi.object().keys({
			BearsFee: Joi.bool(),
		}),
		PaymentEntity: Joi.object().keys({
			Type: Joi.string().required(),
			Country: Joi.string().required(),
		}),
	})});

module.exports = {
	fee_validator,
	compute_validator
};


