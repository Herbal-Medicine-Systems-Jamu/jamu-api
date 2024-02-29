const Ethnic = require('../models/ethnic');
var fs = require('fs');
var path = require('path');

module.exports = {
    index: async(req, res, next) => {
        await Ethnic.find({})
            .select('-__v')
            .populate('refProvince')
            .populate('refPlantethnic')
            .exec(function(err, ethnics) {
                if (err) return next(err);

                res.status(200).json({
                    success: true,
                    message: 'show all ethnics are success',
                    lenght: ethnics.length,
                    data: ethnics
                });
                
            });    
    },

    getlist: async(req, res, next) => {
        await Ethnic.find({})
            .select('name')
            .exec(function(err, ethics) {
                if (err) return next(err);

                res.status(200).json({
                    success: true,
                    message: 'show all ethics are success',
                    lenght: ethics.length,
                    data: ethics
                });
                
            });    
    },
    
    detail: async(req, res, next) => {
        
        const id = req.params.id;
        
        var ethnic = await Ethnic
                            .findById(id)
                            .populate('refProvince')
                            .populate('refPlantethnic')
                            .select('-__v')

        if(!ethnic){
            res.status(404).json({
                success: false,
                message: "didn't find any ethnic"
            })
        }else{
            res.json({
                success: true,
                message: "Detail ethnic read",
                data: ethnic
            });
        }
    },


    create: async(req, res, next) => {      

        var {name, refProvince, refPlantethnic} = req.body;
        const newEthnic = new Ethnic({
            name                 : name,
            refProvince          : refProvince,
            refPlantethnic       : refPlantethnic
        });
        
        await newEthnic.save();
        
        res.status(201).json({
            success: true,
            message: 'New ethnic is created',
            data: newEthnic
        });
    },

    update: async(req, res, next) => {
        const id = req.params.id;
        let province = req.body.refProvince;
        console.log(province);
        let name = req.body.name;
        var ethnic = await Ethnic.findById(id);
        if(!ethnic){
            res.json({
                success: false, 
                message: 'Updated ethnic failed'
            });
        }
        if(province){
            console.log('he');
            ethnic.refProvince = province;
        }
        ethnic.name        = name;
        ethnic.refPlantethnic = req.body.refPlantethnic;
        await ethnic.save();

        res.status(201).json({
            success: true,
            message: 'Ethnic updated',
            data: ethnic
        });
    },

    delete: async(req, res, next) => {
        const id = req.params.id;
        var ethnic = await Ethnic.findById(id);
        if(!ethnic){
            res.json({
                success: false, 
                message: 'Deleted ethnic failed or id did not find'
            });
        }else{
            await ethnic.delete();

            res.json({
                success: true, 
                message: 'Deleted ethnic success'
            });
        }
    }

}