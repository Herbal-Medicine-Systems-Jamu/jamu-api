const Plant = require("../models/plant");
var fs = require("fs");
const PlantCrude = require("../models/plantcrude");
const CrudeDrug = require("../models/crudedrug");
const User = require("../models/user");
const Combination = require("../models/combination");
const HerbsMed = require("../models/herbsmed");
// const xlstojson = require('xls-to-json');
var exceltojson = require("xlsx-to-json");
// const excelToJson = require('convert-excel-to-json');

module.exports = {
  test: async (req, res, next) => {
    exceltojson(
      {
        input: "plant.xlsx",
        output: null, //since we don't need output.json
        lowerCaseHeaders: true
      },
      async function(err, result) {
        if (err) {
          return res.json({ error_code: 1, err_desc: err, data: null });
        }
        // var jsonContent = JSON.stringify(result);
        // console.log(jsonContent);
        for (const hasil of result) {
          idplant = hasil.idplant.toUpperCase();
          const checkIdPlant = await Plant.findOne({ idplant });

          if (checkIdPlant) {
            return res.status(403).json({
              success: false,
              message: "Id Plant is already in used"
            });
          }

          const newPlant = new Plant({
            idplant: idplant,
            sname: hasil.sname,
            refimg: hasil.refimg
          });
          await newPlant.save();
          console.log(hasil);
        }
        res.json({
          error_code: 0,
          err_desc: null,
          data: result,
          lengt: result.length
        });
      }
    );
    // try {
    //     exceltojson({
    //         input: 'plant.xlsx',
    //         output: null, //since we don't need output.json
    //         lowerCaseHeaders:true
    //     }, function(err,result){
    //         if(err) {
    //             return res.json({error_code:1,err_desc:err, data: null});
    //         }
    //         // var jsonContent = JSON.stringify(result);
    //         // console.log(jsonContent);
    //         for(const hasil of result){
    //             idplant = hasil.idplant.toUpperCase();
    //             const checkIdPlant = await Plant.findOne({idplant});

    //             if(checkIdPlant){
    //                 return res.status(403).json({
    //                     success: false,
    //                     message: 'Id Plant is already in used'
    //                 });
    //             }

    //             const newPlant = new Plant({
    //                 idplant : idplant,
    //                 sname   : hasil.sname,
    //                 refimg  : hasil.refimg,
    //             });
    //             await newPlant.save();
    //         }
    //         res.json({error_code:0,err_desc:null, data: result, lengt: result.length});
    //         // fs.writeFileSync('./output.json', result.join(',') , 'utf-8');
    //         // console.log(result);
    //     });
    // } catch (e){
    //     res.json({error_code:1,err_desc:"Corupted excel file"});
    // }
  },
  search: async (req, res, next) => {
    // const term =req.query.search;
    // console.log(req.query.search);
    const term = req.query.search;
    // console.log(term);

    await Plant.find(
      {
        sname: {
          $regex: new RegExp(term, "i")
        }
      },
      {
        _id: 0,
        __v: 0
      },
      function(err, data) {
        res.json({
          success: true,
          message: "show searchs",
          data: data
        });
      }
    ).populate("refCrude", "idcrude sname");
  },

  sortDate: async (req, res, next) => {
    const term = req.body.search;
    let sort_date = req.body.date;
    let name = req.body.name;
    if (name == "asc") {
      name = 1;
    } else {
      name = -1;
    }

    if (sort_date == "asc") {
      sort_date = 1;
    } else {
      sort_date = -1;
    }

    Plant.find(
      {
        // deal_id:deal._id // Search Filters
        sname: {
          $regex: new RegExp(term, "i")
        }
      },
      {
        _id: 0,
        __v: 0
      },
      // ['type','date_added'], // Columns to Return
      {
        skip: 0, // Starting Row
        limit: 10, // Ending Row
        sort: { sname: name, created_at: sort_date }
      },
      function(err, data) {
        res.json({
          success: true,
          message: "show searchs",
          data: data
        });
      }
    );
  },

  getAll: async (req, res, next) => {
    var perPage = 10;
    var page = req.params.page || 1;

    await Plant.find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("refCrude", "idcrude sname")
      .exec(function(err, plants) {
        Plant.count().exec(function(err, count) {
          if (err) return next(err);
          res.status(200).json({
            success: true,
            message: "show all plants are success",
            lenght: plants.length,
            current: page,
            pages: Math.ceil(count / perPage),
            data: plants
          });
        });
      });
  },

  list: async (req, res, next) => {
    const plants = await Plant.find({}).select("idplant sname");
    if (!plants) {
      res.status(404).json({
        success: false,
        message: "did not find any plants "
      });
    }
    res.status(200).json({
      success: true,
      message: "show all plants are success",
      lenght: plants.length,
      data: plants
    });
  },

  getPlant: async (req, res, next) => {
    const idplant = req.params.idplant.toUpperCase();

    var plant = await Plant.findOne({ idplant })
      .select("-__v")
      .populate("refCrude", "idcrude sname")
      .populate("refCompound")
      .populate("refEthnic");

    if (!plant) {
      res.status(404).json({
        success: false,
        message: "didn't find any plant"
      });
    } else {
      res.json({
        success: true,
        message: "Detail plant read",
        data: plant
      });
    }
  },

  add: async (req, res, next) => {
    var { idplant, sname, refimg, refCrude } = req.value.body;
    var datetime = new Date();

    idplant = idplant.toUpperCase();
    const checkIdPlant = await Plant.findOne({ idplant });

    if (checkIdPlant) {
      return res.status(403).json({
        success: false,
        message: "Id Plant is already in used"
      });
    }

    const newPlant = new Plant({
      idplant: idplant,
      sname: sname,
      refimg: refimg,
      refCrude: refCrude,
      created_at: datetime,
      updated_at: datetime,
      user_id: req.user.id
    });
    await newPlant.save();

    res.status(201).json({
      success: true,
      message: "New plant is created",
      data: newPlant
    });
  },

  update: async (req, res, next) => {
    const idplant = req.params.idplant.toUpperCase();

    if (req.body.sname === "") {
      throw new Error("Required sname");
    }

    Plant.findOneAndUpdate(
      { idplant },
      {
        sname: req.body.sname,
        refimg: req.body.refimg,
        refCrude: req.body.refCrude
      },
      { new: true },
      function(err, plant) {
        if (err) {
          return res.json({
            success: false,
            message: "Update Plant failed. " + err
          });
        }
        // const plant = Plant.findOne({idplant});
        res.json({
          success: true,
          message: "Successful updated plant.",
          data: plant
        });
      }
    );
  },

  delete: async (req, res, next) => {
    const idplant = req.params.idplant.toUpperCase();

    Plant.findOneAndRemove({ idplant })
      .exec()
      .then(result => {
        if (!result) {
          return res.status(200).json({
            success: false,
            message: "Delete plant error / id did not found"
          });
        }
        res.status(200).json({
          success: true,
          message: "Delete plant success"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }
};
