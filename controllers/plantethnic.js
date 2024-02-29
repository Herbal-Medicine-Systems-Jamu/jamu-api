const Plantethnic = require("../models/plantethnic");

module.exports = {
  all: async (req, res, next) => {
    await Plantethnic.find({}).exec(function(err, tacits) {
      if (err) return next(err);

      res.status(200).json({
        success: true,
        message: "show all tacits are success",
        lenght: tacits.length,
        data: tacits
      });
    });
  },

  index: async (req, res, next) => {
    var perPage = 10;
    var page = req.params.page || 1;

    await Plantethnic.find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .select("-__v")
      .exec(function(err, tacits) {
        Plantethnic.count().exec(function(err, count) {
          if (err) return next(err);
          res.status(200).json({
            success: true,
            message: "show all tacits are success",
            lenght: tacits.length,
            current: page,
            pages: Math.ceil(count / perPage),
            data: tacits
          });
        });
      });
  },

  list: async (req, res, next) => {
    const plantethnics = await Plantethnic.find({}).select(
      "name_ina ethnic species"
    );
    if (!plantethnics) {
      res.status(404).json({
        success: false,
        message: "did not find any plantethnics "
      });
    }
    res.status(200).json({
      success: true,
      message: "show all plantethnics are success",
      lenght: plantethnics.length,
      data: plantethnics
    });
  },

  detail: async (req, res, next) => {
    const id = req.params.id;

    var plantethnic = await Plantethnic.findById(id)
      .populate("refEthnic", "name province")
      .populate("refProvince", "province_name province_lat province_lon")
      .select("-__v");

    if (!plantethnic) {
      res.status(404).json({
        success: false,
        message: "didn't find any plantethnic"
      });
    } else {
      res.json({
        success: true,
        message: "Detail plantethnic read",
        data: plantethnic
      });
    }
  },

  create: async (req, res, next) => {
    var {
      refEthnic,
      refProvince,
      refPlant,
      refCrudedrug,
      name_ina,
      disease_ina,
      disease_ing,
      species,
      section_ina,
      section_ing,
      family,
      ethnic
    } = req.value.body;
    const newPlantethnic = new Plantethnic({
      ethnic: ethnic,
      name_ina: name_ina,
      disease_ina: disease_ina,
      disease_ing: disease_ing,
      species: species,
      section_ina: section_ina,
      section_ing: section_ing,
      family: family,
      refProvince: refProvince,
      refEthnic: refEthnic,
      refPlant: refPlant,
      refCrudedrug: refCrudedrug
    });

    await newPlantethnic.save();

    res.status(201).json({
      success: true,
      message: "New plantethnic is created",
      data: newPlantethnic
    });
  },

  update: async (req, res, next) => {
    const id = req.params.id;
    var plantethnic = await Plantethnic.findById(id);
    if (!plantethnic) {
      res.json({
        success: false,
        message: "Updated plantethnic failed"
      });
    }

    plantethnic.ethnic = req.body.ethnic;
    plantethnic.name_ina = req.body.name_ina;
    plantethnic.disease_ina = req.body.disease_ina;
    plantethnic.disease_ing = req.body.disease_ing;
    plantethnic.species = req.body.species;
    plantethnic.section_ina = req.body.section_ina;
    plantethnic.section_ing = req.body.section_ing;
    plantethnic.family = req.body.family;
    plantethnic.refProvince = req.body.refProvince;
    plantethnic.refEthnic = req.body.refEthnic;
    plantethnic.refPlant = req.body.refPlant;
    plantethnic.refCrudedrug = req.body.refCrudedrug;
    await plantethnic.save();

    res.status(201).json({
      success: true,
      message: "Plantethnic updated",
      data: plantethnic
    });
  },

  delete: async (req, res, next) => {
    const id = req.params.id;
    var plantethnic = await Plantethnic.findById(id);
    if (!plantethnic) {
      res.json({
        success: false,
        message: "Deleted plantethnic failed"
      });
    } else {
      await plantethnic.delete();

      res.json({
        success: true,
        message: "Deleted plantethnic success"
      });
    }
  }
};
