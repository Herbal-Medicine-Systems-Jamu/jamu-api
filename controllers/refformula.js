const Refformula = require('../models/refformula');
const Herbsmed = require('../models/herbsmed');
module.exports = {
    index: async(req, res, next) => {
        var perPage = 10
        var page = req.params.page || 1

        await Refformula.find({})
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .select('-__v')
                .exec(function(err, refformulas) {
                    Refformula.count().exec(function(err, count) {
                        if (err) return next(err)
                        res.status(200).json({
                            success: true,
                            message: 'show all refformulas are success',
                            lenght: refformulas.length,
                            current: page,
                            pages: Math.ceil(count / perPage),
                            data: refformulas,
                            
                        });
                    })
                }); 

    },

    detailRefformula: async(req, res, next) => {
        const idformula = req.params.idformula.toUpperCase();
        console.log(idformula);
        const refformula = await Refformula.findOne({idformula})
                                    .populate('refHerbsmed','-refCrude -__v')
                                    .select('-__v');
                                    
        if(!refformula){
            return res.status(404).json({
                success: false,
                message: 'refformula not found',
            });
        }

        return res.json({
            success: true,
            message: 'refformula are found',
            data: refformula
        });
        
    },

    showHerbsmed: async(req, res, next) => {
        console.log('tes');
        const herbsmeds = await Herbsmed.find({}).select('idherbsmed name');

        return res.status(200).json({
            success: true,
            message: 'show all herbsmed list',
            length: herbsmeds.length,
            herbsmed: herbsmeds
        });
    },

    create: async(req, res, next) => {
        var {idformula, idherbsmed, ref, refHerbsmed} = req.value.body;
        idformula = idformula.toUpperCase();
        
        const checkRefformula = await Refformula.findOne({idformula});
        if(checkRefformula){
            return res.status(403).json({
                success: false,
                message: 'Id refformula is already used'
            });
        }

        const newRefformula = new Refformula({
            idformula: idformula,
            idherbsmed: idherbsmed,
            refHerbsmed: refHerbsmed,
            ref: ref
        });

        await newRefformula.save();
        // newRefformula.refHerbsmed = req.body

        return res.status(201).json({
            success: true,
            message: 'new refformula is created',
            data: newRefformula
        })
    },

    update: async(req, res, next) => {
        idformula = req.params.idformula.toUpperCase();
        console.log(idformula);
        
        refformula = await Refformula.findOne({idformula})
                            .select('-__v')
                            .populate('refHerbsmed', '-__v -refCrude');

        if(!refformula){
            return res.status(403).json({
                success: false,
                message: 'Id type not found'
            });
        }

        refformula.idherbsmed = req.body.idherbsmed;
        refformula.ref = req.body.ref;
        refformula.refHerbsmed = req.body.refHerbsmed;
        await refformula.save();

        return res.status(200).json({
            success: true,
            message: 'refformula has been updated',
            data: refformula
        });

    },

    delete: async(req, res, next) => {
        const idformula = req.params.idformula.toUpperCase();
        await Refformula.findOneAndRemove({idformula})
            .exec()
            .then(result => {
                if(!result){
                    return res.status(404).json({
                        success: false,
                        message: 'refformula not found',
                    });    
                }
                return res.status(200).json({
                    success: true,
                    message: 'Delete refformula success',
                });
            })
            .catch(err => {
                console.log(err);
            });
    }

}