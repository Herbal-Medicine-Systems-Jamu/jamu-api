const Plant = require("../models/plant");
const PlantCrude = require("../models/plantcrude");
const CrudeDrug = require("../models/crudedrug");
const RefFormula = require("../models/refformula");
const Combination = require("../models/combination");
const User = require("../models/user");
const Pivot = require("../models/pivot");
const HerbsMed = require("../models/herbsmed");
const MedType = require("../models/medtype");
const Company = require("../models/company");
const Dclass = require("../models/dclass");
const PlantEthnic = require("../models/plantethnic");
const Ethnic = require("../models/ethnic");

const Compound = require("../models/compound");
const Senyawa = require("../models/senyawa");
const Crudecompound = require("../models/crudecompounds");
const { resolveContent } = require("nodemailer/lib/shared");

module.exports = {
  plant: async (req, res, next) => {
    PlantCrude.find({}).exec((err, plantCrudes) => {
      if (err) {
        res.json({
          success: false,
          message: "Sorry we cant find any plantcrudes" + err
        });
        console.log(err);
      }
      // Identify each plantcrude
      plantCrudes.forEach(itemPlantCrude => {
        // find relation plantcrude(idplant) with plant(idplant)
        Plant.findOneAndUpdate(
          { idplant: itemPlantCrude.idplant },
          { $push: { refCrude: itemPlantCrude.refCrude } },
          { new: true, upsert: true },
          (err, doc) => {
            if (err) {
              console.log("something error");
            }
            // console.log(doc._id);
          }
        );
      });

      res.json({
        success: true,
        message: "All crude has been generate to the plants"
      });
    });
  },

  plantCrude: async (req, res, next) => {
    let i = 0;
    PlantCrude.find({}).exec((err, plantCrudes) => {
      if (err) {
        res.json(err);
        console.log(err);
      }

      plantCrudes.forEach(itemPlantCrude => {
        // console.log(i++);
        Plant.findOne({ idplant: itemPlantCrude.idplant })
          .select("_id")
          .exec()
          .then(plant => {
            itemPlantCrude.refPlant = plant._id;
            // itemPlantCrude.save();
          })
          .catch(err => {
            console.log(err);
          });

        CrudeDrug.findOne({ idcrude: itemPlantCrude.idcrude })
          .select("_id")
          .exec()
          .then(crudedrug => {
            itemPlantCrude.refCrude = crudedrug._id;
            itemPlantCrude.save();
            // console.log(crudedrug);
          })
          .catch(err => {
            console.log(err);
          });
      });

      res.json({
        success: true,
        message: "All crude and plant has been generate to the PlantCrudes"
      });
    });
  },

  crudeDrug: async (req, res, next) => {
    let i = 0;
    PlantCrude.find({}).exec((err, plantCrudes) => {
      if (err) {
        res.json({
          success: false,
          message: "Sorry we cant find any crudedrugs" + err
        });
        console.log(err);
      }
      // Identify each plantcrude
      plantCrudes.forEach(itemPlantCrude => {
        // console.log(i++);
        // find relation plantcrude(idplant) with plant(idplant)
        CrudeDrug.findOneAndUpdate(
          { idcrude: itemPlantCrude.idcrude },
          { $push: { refPlant: itemPlantCrude.refPlant } },
          { new: true, upsert: true },
          (err, doc) => {
            if (err) {
              console.log("something error");
            }
            // console.log(doc._id);
          }
        );
      });

      res.json({
        success: true,
        message: "All crude has been generate to the plants"
      });
    });
  },

  combination: async (req, res, next) => {
    let i = 0;
    combinations = await Combination.find({});
    for (const combination of combinations) {
      console.log(i++);
      await CrudeDrug.findOne({ idcrude: combination.idcrude })
        .select("_id idcrude")
        .exec()
        .then(crudedrug => {
          combination.refCrude = crudedrug._id;
        })
        .catch(err => {
          console.log(err);
        });

      await HerbsMed.findOne({ idherbsmed: combination.idherbsmed })
        .select("_id idherbsmed")
        .exec()
        .then(async herb => {
          combination.refHerbsMed = herb._id;
          await combination.save();
        })
        .catch(err => {
          console.log(err);
        });
    }

    //ga keluar kalo pake for :(
    await res.json({
      success: true,
      message: "all combination has been generated"
    });

    await res.send(
      JSON.stringify({
        success: true,
        message: "all combination has been generated 100"
      })
    );
  },

  herbsMed: async (req, res, next) => {
    let i = 0;
    let j = 0;
    herbsmeds = await HerbsMed.find({});
    combinations = await Combination.find({});

    for (const herbsmed of herbsmeds) {
      console.log("herb", i++);
      await MedType.findOne({ idtype: herbsmed.idtype })
        .select("_id idtype")
        .exec()
        .then(async medtype => {
          herbsmed.refMedtype = medtype._id;
          await herbsmed.save();
          console.log(herbsmed.refMedtype);
        })
        .catch(err => {
          console.log(err);
        });

      await Dclass.findOne({ idclass: herbsmed.idclass })
        .select("_id idclass")
        .exec()
        .then(async dclass => {
          herbsmed.refDclass = dclass._id;
        })
        .catch(err => {
          console.log(err);
        });

      await Company.findOne({ idcompany: herbsmed.idcompany })
        .select("_id idcompany")
        .exec()
        .then(async company => {
          herbsmed.refCompany = company._id;
          herbsmed.save();
        })
        .catch(err => {
          console.log(err);
        });
    }

    for (const combination of combinations) {
      // console.log('combination', j++);
      await HerbsMed.findOne({ idherbsmed: combination.idherbsmed })
        .select("_id idherbsmed refCrude")
        .exec()
        .then(async herbsmedUpdate => {
          herbsmedUpdate.refCrude.push(combination.refCrude);
          await herbsmedUpdate.save();
          console.log("combinations", herbsmedUpdate.refCrude);
        })
        .catch(err => {
          console.log(err);
        });
    }

    // console.log('ok');

    res.json({
      success: true,
      message: "All herbsmed has been generated"
    });
  },

  plantEthnic: async (req, res, next) => {
    console.log("YESSS");
    let i = 0;

    // plants = await PlantEthnic.find({});

    // res.json({
    //     data: plants
    // })

    PlantEthnic.find({}).exec((err, plantEthnics) => {
      if (err) {
        res.json({
          success: false,
          message: "Sorry we cant find any plantethnics" + err
        });
        console.log(err);
      }
      // Identify each plantcrude
      plantEthnics.forEach(itemPlantethnic => {
        // console.log(itemPlantethnic.ethnic);
        // console.log(i++);
        // find relation plantcrude(idplant) with plant(idplant)
        Ethnic.findOneAndUpdate(
          { name: itemPlantethnic.ethnic },
          { $push: { refPlantethnic: itemPlantethnic._id } },
          { new: true, upsert: true },
          (err, doc) => {
            if (err) {
              console.log("something error");
            }
            // console.log(doc._id);
          }
        );
      });

      res.json({
        success: true,
        message: "All plantethnic has been generate"
      });
    });
  },

  model: async (req, res) => {
    // let {model, plant} = req.value.body;

    Dclass.find({}).exec((err, dclasses) => {
      if (err) {
        res.json({
          success: false,
          message: "Sorry we cant find any dclass" + err
        });
        console.log(err);
      }

      var item = dclasses[Math.floor(Math.random() * dclasses.length)];
      console.log(item);
      res.json({
        success: true,
        message: "succes",
        data: item
      });
    });
  },

  //sambung plant dengan plant ethnnic
  plantEthnic: async (req, res, next) => {
    plantEthnic = await PlantEthnic.find({});

    plantEthnic.forEach(async dt => {
      let name = await dt.species.split(" ");
      let term = name[0] + " " + name[1];
      await Plant.findOne({
        sname: {
          $regex: new RegExp(term, "i")
        }
      })
        .select("_id")
        .exec()
        .then(plant => {
          console.log(plant._id);
          dt.refPlant = plant._id;
          dt.save();
        })
        .catch(err => {
          console.log(err);
        });
    });
    res.json({
      success: true,
      message: "All Plant Ethnic has been generated"
    });
  },

  PlantPlantEthnic: async (req, res, next) => {
    plantEthnic = await PlantEthnic.find({});

    plantEthnic.forEach(async dt => {
      await Plant.findOne({ _id: dt.refPlant })
        .select("_id refEthnic")
        .exec()
        .then(plant => {
          plant.refEthnic.push(dt._id);
          plant.save();
        })
        .catch(err => {
          console.log(err);
        });
    });
    res.json({
      success: true,
      message: "All Plant Ethnic has been generated"
    });
  },

  crudeHersbmed: async (req, res, next) => {
    herbsMed = await HerbsMed.find({});
    herbsMed.forEach(async dt => {
      dt.refCrude.forEach(async itm => {
        await CrudeDrug.findOne({ _id: itm })
          .select("_id idcrude refHerbsMed")
          .exec()
          .then(async crude => {
            crude.refHerbsMed.push(dt._id);
            await crude.save();
          })
          .catch(err => {
            console.log(err);
          });
      });
    });
    res.json({
      success: true,
      message: "All Plant Ethnic has been generated"
    });
  },

  // MULAI DARI SINI UNTUK SENYAWA

  refPlantToSenyawa: async (req, res, next) => {
    senyawa = await Senyawa.find({});

    senyawa.forEach(async dt => {
      let name = await dt.plant_species.split(" ");
      let term = name[0] + " " + name[1];
      await Plant.findOne({
        sname: {
          $regex: new RegExp(term, "i")
        }
      })
        .select("_id")
        .exec()
        .then(plant => {
          dt.refPlant = plant._id;
          dt.save();
        })
        .catch(err => {
          console.log(err);
        });
    });
    res.json({
      success: true,
      message: "refPlant di seyawa succes"
    });
  },

  refCompoundToSenyawa: async (req, res, next) => {
    senyawa = await Senyawa.find({});

    senyawa.forEach(async dt => {
      await Compound.findOne({
        cname: dt.cname
      })
        .select("_id")
        .exec()
        .then(c => {
          dt.refCompound = c._id;
          dt.save();
        })
        .catch(err => {
          console.log(err);
        });
    });
    res.json({
      success: true,
      message: "All compound has been generated"
    });
  },

  refPlantToCrudeCompound: async (req, res, next) => {
    crudecompound = await Crudecompound.find({});

    crudecompound.forEach(async dt => {
      await Senyawa.findOne({
        plant_species: dt.plant_species
      })
        .select("refPlant")
        .exec()
        .then(plant => {
          dt.refPlant = plant.refPlant;
          dt.save();
        })
        .catch(err => {
          console.log(err);
        });
    });
    res.json({
      success: true,
      message: "All compound has been generated"
    });
  },

  // menyambungkan refCrudeCompound dengan senyawa
  refCrudeCompoundToSenyawa: async (req, res, next) => {
    senyawa = await Senyawa.find({});

    senyawa.forEach(async dt => {
      await Crudecompound.findOne({
        $and: [
          {
            plant_species: dt.plant_species
          },
          { part: dt.part }
        ]
      })
        .select("_id")
        .exec()
        .then(crude => {
          dt.refCrudeCompound = crude._id;
          dt.save();
        })
        .catch(err => {
          console.log(err);
        });
    });
    res.json({
      success: true,
      message: "All compound has been generated"
    });
  },

  //CrudeCompound dia ngambil compound id dari senyawas
  refCompoundToCrudeCompound: async (req, res, next) => {
    crudecompound = await Crudecompound.find({});

    crudecompound.forEach(async dt => {
      await Senyawa.find({
        $and: [
          {
            plant_species: dt.plant_species
          },
          { part: dt.part }
        ]
      })
        .select("_id refCompound")
        .exec()
        .then(crude => {
          crude.forEach(pl => {
            dt.refCompound.push(pl.refCompound);
          });
          dt.save();
        })
        .catch(err => {
          console.log(err);
        });
    });
    res.json({
      success: true,
      message: "All compound has been generated"
    });
  },

  refCrudeCompoundToCompound: async (req, res, next) => {
    crudecompound = await Crudecompound.find({});

    crudecompound.forEach(async dt => {
      dt.refCompound.forEach(async itm => {
        await Compound.findOne({
          _id: itm
        })
          .select("_id refCrudeCompound")
          .exec()
          .then(compound => {
            compound.refCrudeCompound.push(dt._id);
            compound.save();
          })
          .catch(err => {
            console.log(err);
          });
      });
    });
    res.json({
      success: true,
      message: "All compound has been generated"
    });
  },

  refPlantToCompound: async (req, res, next) => {
    crudecompound = await Crudecompound.find({});

    crudecompound.forEach(async dt => {
      dt.refCompound.forEach(async itm => {
        await Compound.findOne({
          _id: itm
        })
          .select("_id refPlant")
          .exec()
          .then(compound => {
            compound.refPlant.push(dt.refPlant);
            compound.save();
          })
          .catch(err => {
            console.log(err);
          });
      });
    });
    res.json({
      success: true,
      message: "All compound has been generated"
    });
  },

  refPlantToCompoundDistinc: async (req, res, next) => {
    compound = await Compound.find({});

    compound.forEach(async dt => {
      let refPlant = dt.refPlant;
      console.log(refPlant);

      const unique = (value, index, self) => {
        return self.indexOf(value) === index;
      };
      const uniqueValues = refPlant.filter(unique);
      dt.refPlant = uniqueValues;
      dt.save();
    });
    res.json({
      success: true,
      message: "All compound has been generated"
    });
  },

  refCompoundToPlant: async (req, res, next) => {
    compound = await Senyawa.find({});

    compound.forEach(async dt => {
      await Plant.findOne({ _id: dt.refPlant })
        .select("_id refCompound")
        .exec()
        .then(async plant => {
          plant.refCompound.push(dt.refCompound);
          await plant.save();
        })
        .catch(err => {
          console.log(err);
        });
    });
    res.json({
      success: true,
      message: "All compound has been generated"
    });
  },

  refCompoundToPlantDistinc: async (req, res, next) => {
    plant = await Plant.find({});

    plant.forEach(async dt => {
      let refCompound = dt.refCompound;
      console.log(refCompound)

      const unique = (value, index, self) => {
        return self.indexOf(value) === index;
      };
      const uniqueValues = refCompound.filter(unique);
      dt.refCompound = uniqueValues;
      dt.save();
    });
    res.json({
      success: true,
      message: "All plant has been generated"
    });
  },

  inputNewMetabolite: async(req, res, next) => {
    pivot = await Pivot.find({});
    // pivot = [pivot[0],pivot[1],pivot[2],pivot[3],pivot[4]];
    // Promise.all(
    //   pivot.forEach(async dt => {
    //     try{
    //       compound = await Compound.findOne({compound_id: dt.cid}).select("_id, refPlant").exec();
    //       plant = await Plant.findOne({idplant: dt.pid}).select("_id, refCompound").exec();
    //       if (compound.refPlant === undefined) {
    //         compound.refPlant = [];
    //         compound.refPlant.push(plant._id);
    //       } else {
    //         compound.refPlant.push(plant._id);
    //       }
    //       await compound.save();
    //       plant.refCompound.push(compound._id);
    //       await plant.save();
    //     } catch(err){
    //       console.log(err)
    //     }
       
    //   })
    // );

   pivot.forEach(async dt => {
      await Plant.findOne({ idplant: dt.pid })
        .select("_id refCompound")
        .exec()
        .then(async plant => {
          await Compound.findOne({ compound_id: dt.cid})
          .select("_id refPlant")
          .exec()
          .then( async compound => {
            
            compound.refPlant.push(plant._id);
            plant.refCompound.push(compound._id);
            await compound.save();
            await plant.save();
          })
          .catch(err => {
            console.log(err);
          });
        })
        .catch(err => {
          console.log(err);
        });
    })   

    res.json({
      success: true,
      message: "All compound has been generated"
    });
  }
};
