const Medtype = require('../models/medtype');

module.exports = {
    index: async(req, res, next) => {
        const medtypes = await Medtype.find({});

        res.status(200).json({
            success: true,
            message: 'shows all medtypes are success',
            length: medtypes.length,
            data: medtypes
        })
    },

    detailMedtype: async(req, res, next) => {
        const idtype = req.params.idtype;
        const medtype = await Medtype.findOne({idtype}).select('-__v');
        if(!medtype){
            return res.status(404).json({
                success: false,
                message: 'medtype not found',
            });
        }

        return res.json({
            success: true,
            message: 'medtype are found',
            data: medtype
        });
        
    },

    create: async(req, res, next) => {
        var {idtype, medname} = req.value.body;

        const checkMedtype = await Medtype.findOne({idtype});
        if(checkMedtype){
            return res.status(403).json({
                success: false,
                message: 'Id type is already used'
            });
        }

        const newMedtype = new Medtype({
            idtype: idtype,
            medname: medname
        });

        await newMedtype.save();

        return res.status(201).json({
            success: true,
            message: 'new medtype is created',
            data: newMedtype
        })
    },

    update: async(req, res, next) => {
        idtype = req.params.idtype;
        console.log(idtype);
        console.log(req.body.medname);
        
        medtype = await Medtype.findOne({idtype}).select('-__v');
        console.log(medtype.medname);
        if(!medtype){
            return res.status(403).json({
                success: false,
                message: 'Id type not found'
            });
        }

        medtype.medname = req.body.medname
        await medtype.save();

        return res.status(200).json({
            success: true,
            message: 'medtype has been updated',
            data: medtype
        });

    },

    delete: async(req, res, next) => {
        const idtype = req.params.idtype.toLowerCase();

        Medtype.findOneAndRemove({idtype})
            .exec()
            .then(result => {
                if(!result){
                    return res.status(404).json({
                        success: false,
                        message: 'medtype not found',
                    });    
                }
                return res.status(200).json({
                    success: true,
                    message: 'Delete medtype success',
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

}