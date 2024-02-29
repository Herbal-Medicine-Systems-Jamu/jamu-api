const Province = require('../models/province');
var fs = require('fs');
var path = require('path');

module.exports = {
    index: async(req, res, next) => {
        await Province.find({})
            .select('-__v')
            .exec(function(err, provinces) {
                if (err) return next(err);

                res.status(200).json({
                    success: true,
                    message: 'show all provinces are success',
                    lenght: provinces.length,
                    data: provinces
                });
                
            });    
    },

    getlist: async(req, res, next) => {
        await Province.find({})
            .select('province_name')
            .exec(function(err, provinces) {
                if (err) return next(err);

                res.status(200).json({
                    success: true,
                    message: 'show all provinces are success',
                    lenght: provinces.length,
                    data: provinces
                });
                
            });    
    },
    
    detail: async(req, res, next) => {
        
        const id = req.params.id;
        
        var province = await Province
                            .findById(id)
                            .select('-__v')

        if(!province){
            res.status(404).json({
                success: false,
                message: "didn't find any province"
            })
        }else{
            res.json({
                success: true,
                message: "Detail province read",
                data: province
            });
        }
    },


    create: async(req, res, next) => {
        var {province_id, province_name, province_name_abbr, province_name_id, province_name_en, province_capital_city_id, iso_code, iso_name, iso_type, iso_geounit, province_lat, province_lon} = req.value.body;      
        const newProvince = new Province({
            province_id                 : province_id,
            province_name               : province_name,
            province_name_abbr          : province_name_abbr,
            province_name_id            : province_name_id,
            province_name_en            : province_name_en,
            province_capital_city_id    : province_capital_city_id,
            iso_code                    : iso_code,
            iso_name                    : iso_name,
            iso_type                    : iso_type,
            iso_geounit                 : iso_geounit,
            timezone                    : Date.now(),
            province_lat                : province_lat,
            province_lon                : province_lon

        });
        
        await newProvince.save();
        
        res.status(201).json({
            success: true,
            message: 'New province is created',
            data: newProvince
        });
    },

    update: async(req, res, next) => {
        const id = req.params.id;
        var province = await Province.findById(id);
        if(!province){
            res.json({
                success: false, 
                message: 'Updated province failed'
            });
        }
        
        province.province_id                 = req.body.province_id;
        province.province_name               = req.body.province_name;
        province.province_name_abbr          = req.body.province_name_abbr;
        province.province_name_id            = req.body.province_name_id;
        province.province_name_en            = req.body.province_name_en;
        province.province_capital_city_id    = req.body.province_capital_city_id;
        province.iso_code                    = req.body.iso_code;
        province.iso_name                    = req.body.iso_name;
        province.iso_type                    = req.body.iso_type;
        province.iso_geounit                 = req.body.iso_geounit;
        province.timezone                    = Date.now();
        province.province_lat                = req.body.province_lat;
        province.province_lon                = req.body.proince_lon;
        await province.save();

        res.status(201).json({
            success: true,
            message: 'Province updated',
            data: province
        });    
    },

    delete: async(req, res, next) => {
        const id = req.params.id;
        var province = await Province.findById(id);
        if(!province){
            res.json({
                success: false, 
                message: 'Deleted province failed or id did not find'
            });
        }else{
            await province.delete();

            res.json({
                success: true, 
                message: 'Deleted province success'
            });
        }
    }

}