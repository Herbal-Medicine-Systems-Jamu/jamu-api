const CrudeDrug = require("../models/crudedrug");
const Plant = require("../models/plant");

module.exports = {
  search: async (req, res, next) => {
    const term = req.query.search;

    let perPage = 10;
    let page = req.query.page || 1;

    let lenght = await CrudeDrug.find({
      $or: [
        { sname: { $regex: new RegExp(term, "i") } },
        { effect: { $regex: new RegExp(term, "i") } }
      ]
    }).then(data => {
      return data;
    });

    await CrudeDrug.find(
      {
        $or: [
          { sname: { $regex: new RegExp(term, "i") } },
          { effect: { $regex: new RegExp(term, "i") } }
        ]
      },
      {
        _id: 0,
        __v: 0
      }
    )
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("refPlant", "-refCrude")
      .exec(function(err, crude) {
        if (err) return next(err);
        res.status(200).json({
          success: true,
          message: `show search crude ${term} page ${page}`,
          lenght: lenght.length,
          current: page,
          pages: Math.ceil(lenght.length / perPage),
          data: crude
        });
      });
  },

  index: async (req, res, next) => {
    var perPage = 10;
    var page = req.params.page || 1;

    await CrudeDrug.find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .select("-__v")
      .populate("refPlant", "-refCrude")
      .exec(function(err, crudedrugs) {
        CrudeDrug.count().exec(function(err, count) {
          if (err) return next(err);
          res.status(200).json({
            success: true,
            message: "show all crudedrugs are success",
            lenght: crudedrugs.length,
            current: page,
            pages: Math.ceil(count / perPage),
            data: crudedrugs
          });
        });
      });
  },

  list: async (req, res, next) => {
    const crudedrugs = await CrudeDrug.find({}).select("idcrude sname");

    res.status(200).json({
      success: true,
      message: "show all companies are success",
      length: crudedrugs.length,
      data: crudedrugs
    });
  },

  detailCrude: async (req, res, next) => {
    const idcrude = req.params.idcrude.toUpperCase();

    CrudeDrug.findOne({ idcrude })
      .populate("refPlant", "-refCrude")
      .populate("refHerbsMed", "idherbsmed")
      .exec()
      .then(crudedrug => {
        if (!crudedrug) {
          res.status(404).json({
            success: false,
            message: "Detail crudedrug not found"
          });
        }

        res.status(200).json({
          success: true,
          message: "Detail crudedrug success",
          data: crudedrug
        });
      })
      .catch(err => {
        console.log(err);
      });
  },

  showPlants: async (req, res, next) => {
    plants = await Plant.find({}).select("idplant sname");
    if (!plants) {
      return res.status(403).json({
        success: false,
        message: "plants did not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "plants found",
      length: plants.length,
      plant: plants
    });
  },

  create: async (req, res, next) => {
    idcrude = req.body.idcrude;
    idcrude = idcrude.toUpperCase();

    const checkCrude = await CrudeDrug.findOne({ idcrude });

    if (checkCrude) {
      return res.status(403).json({
        success: false,
        message: "Id crude is already exist"
      });
    }

    const newCrudedrug = new CrudeDrug({
      idcrude: idcrude,
      sname: req.body.sname,
      name_en: req.body.name_en,
      name_loc1: req.body.name_loc1,
      name_loc2: req.body.name_loc2,
      gname: req.body.gname,
      position: req.body.position,
      effect: req.body.effect,
      effect_loc: req.body.effect_loc,
      comment: req.body.comment,
      ref: req.body.ref,
      refPlant: req.body.refPlant
    });
    await newCrudedrug.save();

    res.status(201).json({
      success: true,
      message: "new crudedrug is created",
      data: newCrudedrug
    });
  },

  update: async (req, res, next) => {
    const idcrude = req.params.idcrude.toUpperCase();
    CrudeDrug.findOneAndUpdate(
      { idcrude },
      {
        sname: req.body.sname,
        name_en: req.body.name_en,
        name_loc1: req.body.name_loc1,
        name_loc2: req.body.name_loc2,
        gname: req.body.gname,
        position: req.body.position,
        effect: req.body.effect,
        effect_loc: req.body.effect_loc,
        comment: req.body.comment,
        ref: req.body.ref,
        refPlant: req.body.refPlant
      },
      { new: true },
      function(err, crudedrug) {
        if (!crudedrug) {
          return res.json({
            success: false,
            message: "there is no crudedrug"
          });
        }
        if (err) {
          return res.json({
            success: false,
            message: "Updated crudedrug failed"
          });
        }

        res.json({
          success: true,
          message: "Successful updated crudedrug",
          data: crudedrug
        });
      }
    );
  },

  delete: async (req, res, next) => {
    const idcrude = req.params.idcrude.toUpperCase();

    CrudeDrug.findOneAndRemove({ idcrude })
      .exec()
      .then(result => {
        if (!result) {
          return res.status(200).json({
            success: false,
            message: "Delete crudedrug error / id did not found"
          });
        }
        res.status(200).json({
          success: true,
          message: "Delete crudedrug success"
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
