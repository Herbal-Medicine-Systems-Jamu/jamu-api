const Company = require('../models/company');
const Joi = require('joi');

module.exports = {
    index: async(req, res, next) => {
        const companies = await Company.find({});

        res.status(200).json({
            success: true,
            message: 'show all companies are success',
            length: companies.length,
            data: companies
        });
    
    },

    list: async(req, res, next) => {
        const companies = await Company.find({}).select('idcompany cname');
        if(!companies){
            res.status(404).json({
                success: false,
                message: 'did not find any plants'
            });
        }

        res.status(200).json({
            success: false,
            message: 'show all list companies are success',
            length: companies.length,
            data: companies
        });
    },

    detailCompany: async(req, res, next) => {
        const idcompany = req.params.idcompany.toLowerCase();

        Company.findOne({idcompany})
            .exec()
            .then(company => {
                if(!company){
                    res.status(404).json({
                        success: false,
                        message: "Detail company not found"
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "Detail company success",
                    data: company
                });
            })
            .catch(err => {
                console.log(err);
            });
    },

    create: async(req, res, next) => {
        var {idcompany, cname, address, city, country, postcode, contact, url} = req.value.body;

        idcompany = idcompany.toLowerCase();
        
        const checkCompany = await Company.findOne({idcompany});
        if(checkCompany){
            return res.status(403).json({
                success: false,
                message: 'Id company is already exist'
            });
        }

        const newCompany = new Company({
            idcompany: idcompany,
            cname: cname,
            address: address,
            city: city,
            country: country,
            postcode: postcode,
            contact: contact,
            url: url
        });
        await newCompany.save();

        res.status(201).json({
            success: true,
            message: 'new company is created',
            data: newCompany
        });

    },

    update: async(req, res, next) => {
        const idcompany = req.params.idcompany.toLowerCase();
        Company.findOneAndUpdate({idcompany}, {
            cname       : req.body.cname,
            address     : req.body.address,
            city        : req.body.city,
            country     : req.body.country,
            postcode    : req.body.postcode,
            contact     : req.body.contact,
            url         : req.body.url
        }, {new: true},
        function(err, company){
            if(!company){
                return res.json({
                    success: false,
                    message: 'there is no company'
                })
            }
            if(err){
                return res.json({
                    success: false,
                    message: 'Updated company failed'
                });
            }

            res.json({
                success: true,
                message: 'Successful updated company',
                data: company
            });
        })
    },

    delete: async(req, res, next) => {
        const idcompany = req.params.idcompany.toLowerCase();
        await Company.findOneAndRemove({idcompany})
                .exec()
                .then(result => {
                    if(!result){
                        return res.status(200).json({
                            success: false,
                            message: 'Delete company error / id did not found'
                        });
                    }
                    res.status(200).json({
                        success: true,
                        message: 'Delete company success',
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
    }
}