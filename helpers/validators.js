const Joi = require('joi');

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);
            if(result.error){
                return res.status(400).json(result.error);
            }

            if(!req.value){req.value = {}; }
            req.value['body'] = result.value;
            next();
        }
    },

    schemas: {
        signInSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }),

        signUpSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            name: Joi.string().min(6).max(30).required(),
            roles: Joi.string().allow('').optional()
        }),

        plantSchema: Joi.object().keys({
            idplant: Joi.string().required(),
            sname: Joi.string().required(),
            refimg: Joi.string().allow('').optional(),
            refCrude: Joi.array().allow('').optional()
        }),

        dclassSchema: Joi.object().keys({
            idclass: Joi.number().required(),
            class_name: Joi.string().required(),
            diseases: Joi.string().allow('').optional(),
            description: Joi.string().allow('').optional(),
            ref: Joi.string().allow('').optional()
        }),

        refformulaSchema: Joi.object().keys({
            idformula: Joi.string().required(),
            idherbsmed: Joi.string().required(),
            ref: Joi.string().allow('').optional(),
            refHebsmed: Joi.string().allow('').optional()
        }),

        medtypeSchema: Joi.object().keys({
            idtype: Joi.number().required(),
            medname: Joi.string().required(),
        }),

        companySchema: Joi.object().keys({
            idcompany: Joi.string().required(),
            cname: Joi.string().required(),
            address: Joi.string().allow('').optional(),
            city: Joi.string().allow('').optional(),
            country: Joi.string().allow('').optional(),
            postcode: Joi.string().allow('').optional(),
            contact: Joi.string().allow('').optional(),
            url: Joi.string().allow('').optional()
        }),

        crudedrugSchema: Joi.object().keys({
            idcrude: Joi.string().required(),
            sname: Joi.string().required(),
            name_en: Joi.string().allow('').optional(),
            name_loc1: Joi.string().allow('').optional(),
            name_loc2: Joi.string().allow('').optional(),
            gname: Joi.string().allow('').optional(),
            position: Joi.string().allow('').optional(),
            effect: Joi.string().allow('').optional(),
            effect_loc: Joi.string().allow('').optional(),
            comment: Joi.string().allow('').optional(),
            ref: Joi.string().allow('').optional(),
            refPlant: Joi.array().allow('').optional()
        }),

        herbsmedSchema: Joi.object().keys({
            idherbsmed: Joi.string().required(),
            name: Joi.string().required(),
            nameloc1: Joi.string().allow('').optional(),
            nameloc2: Joi.string().allow('').optional(),
            efficacy: Joi.string().allow('').optional(),
            efficacyloc: Joi.string().allow('').optional(),
            ref: Joi.string().allow('').optional(),
            idclass: Joi.string().allow('').optional(),
            idcompany: Joi.string().allow('').optional(),
            idtype: Joi.string().allow('').optional(),
            refDclass: Joi.string().allow('').optional(),
            refCompany: Joi.string().allow('').optional(),
            refCrude: Joi.array().allow('').optional(),
            refMedtype: Joi.array().allow('').optional()
        }),

        provinceSchema: Joi.object().keys({
            province_id: Joi.string().required(),
            province_name: Joi.string().required(),
            province_name_abbr: Joi.string().required(),
            province_name_id: Joi.string().required(),
            province_name_en: Joi.string().required(),
            province_capital_city_id: Joi.string().required(),
            iso_code: Joi.string().required(),
            iso_name: Joi.string().required(),
            iso_type: Joi.string().required(),
            iso_geounit: Joi.string().required(),
            province_lat: Joi.string().required(),
            province_lon: Joi.string().required()
            
        }),

        plantethnicSchema: Joi.object().keys({
            ethnic: Joi.string().allow('').optional(),
            name_ina: Joi.string().required(),
            species: Joi.string().required(),
            disease_ina: Joi.string().required(),
            disease_ing: Joi.string().allow('').optional(),
            section_ina: Joi.string().required(),
            section_ing: Joi.string().allow('').optional(),
            family: Joi.string().required(),
            refEthnic: Joi.string().allow('').optional(),
            refPlant: Joi.string().allow('').optional(),
            refCrudedrug: Joi.string().allow('').optional(),
            refProvince: Joi.string().allow('').optional()
        }),

        changepasswordSchema: Joi.object().keys({
            old_password: Joi.string().required(),
            new_password: Joi.string().required()
        })
    }
}