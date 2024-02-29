// idplant	sname	refimg

// mongoimport --db dbName --collection collectionName --file fileName.json --jsonArray

// convert-excel-to-json --config='{"sourceFile": "tests/test-data.xlsx"}'

// Plant.find({ idplant    : { $regex: /^P/i } }, function(err, plants)

// plants = plants.find({"idplant": "X"})



plantCrudes.forEach((itemPlantCrude) => {
    // find relation plantcrude(idplant) with plant(idplant)
    Plant.findOneAndUpdate({idplant: itemPlantCrude.idplant}, 
        (err, doc) => {
            if(err){console.log(err);}
            // console.log(doc);
            if(doc.refPlantCrudes.includes(itemPlantCrude._id)){
                console.log('waduh');
            }else{
                doc.update({
                    $push: {
                        refPlantCrudes: itemPlantCrude._id
                    }
                }, {new: true},
                (err, doc) => {
                    if(err){console.log(err);}
                    console.log(doc);
                });
            }
            
            console.log('heheh');
        }
    )
    
});