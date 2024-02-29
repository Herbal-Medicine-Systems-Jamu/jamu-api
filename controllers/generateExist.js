const Plant = require('../models/plant');
const PlantCrude = require('../models/plantcrude');


module.exports = {
    plant: async(req, res, next) => {
        
        PlantCrude.find({})
        .exec((err, plantCrudes) => {
            if(err){
                res.json(err);
                console.log(err);
            }

            // SECOND OPTION
            plantCrudes.forEach((itemPlantCrude) => {
                // find relation PlantCrude(idplant) with Plant(idplant)
                Plant.findOne({idplant: itemPlantCrude.idplant})
                .populate('refPlantCrudes', '_id')
                .exec()
                .then(plant => {

                    var isCrudeInArray = plant.refPlantCrudes.some(function (refPlantCrude) {
                        return refPlantCrude.equals(itemPlantCrude.id);
                    });

                    if(isCrudeInArray == false){
                        plant.refPlantCrudes.push(itemPlantCrude.id);
                        plant.save();
                    }
                    
                })       
            });

            res.json({
                success: true,
                message: 'All crudes are generate to plant'
            });
        })
        
    }
    
    

}