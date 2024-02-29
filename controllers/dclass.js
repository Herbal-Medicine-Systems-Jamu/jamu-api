const Dclass = require('../models/dclass');

module.exports = {
    index: async(req, res, next) => {
        const dclasses = await Dclass.find({});

        res.status(200).json({
            success: true,
            message: 'shows all dclasses are success',
            length: dclasses.length,
            data: dclasses
        })
    },

    detailDclass: async(req, res, next) => {
        const idclass = req.params.idclass;
        console.log(idclass);
        const dclass = await Dclass.findOne({idclass});
        console.log(dclass);
        if(!dclass){
            return res.status(404).json({
                success: false,
                message: 'dclass not found',
            });
        }

        return res.json({
            success: true,
            message: 'dclass are found',
            data: dclass
        });
        
    },

    create: async(req, res, next) => {
        var {idclass, class_name, description, diseases, ref} = req.value.body;
        // const idclass = req.body.idclass;

        const checkClass = await Dclass.findOne({idclass});
        if(checkClass){
            return res.status(403).json({
                success: false,
                message: 'Id dclass is already used'
            });
        }

        const newDclass = new Dclass({
            idclass: idclass,
            class: class_name,
            description: description,
            data: diseases,
            ref: ref
        });

        await newDclass.save();

        return res.status(201).json({
            success: true,
            message: 'new dclass is created',
            data: newDclass
        })
    },

    update: async(req, res, next) => {
        idclass = req.params.idclass;
        
        dclass = await Dclass.findOne({idclass}).select('-__v');

        if(!dclass){
            return res.status(403).json({
                success: false,
                message: 'Id dclass not found'
            });
        }

        dclass.class = req.body.class;
        dclass.description = req.body.description;
        dclass.ref = req.body.ref;
        dclass.diseases = req.body.diseases;
        await dclass.save();

        return res.status(200).json({
            success: true,
            message: 'dclass has been updated',
            data: dclass
        });

    },

    delete: async(req, res, next) => {
        const idclass = req.params.idclass;

        Dclass.findOneAndRemove({idclass})
            .exec()
            .then(result => {
                if(!result){
                    return res.status(404).json({
                        success: false,
                        message: 'dclass not found',
                    });    
                }
                return res.status(200).json({
                    success: true,
                    message: 'Delete dclass success',
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

}