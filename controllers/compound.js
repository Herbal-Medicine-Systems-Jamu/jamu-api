const Compound = require("../models/compound");

module.exports = {
  all: async (req, res, next) => {
    await Compound.find({})
      .populate("refPlant")
      .select("-__v")
      .exec(function(err, tacits) {
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

    // const compounds = await Compound.find({}).populate('refPlant');

    // res.status(200).json({
    //     success: true,
    //     message: 'show all compounds are success',
    //     length: compounds.length,
    //     data: compounds
    // });

    await Compound.find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("refPlant")
      .exec(function(err, compounds) {
        Compound.count().exec(function(err, count) {
          if (err) return next(err);
          res.status(200).json({
            success: true,
            message: "show all compounds are success",
            lenght: compounds.length,
            current: page,
            pages: Math.ceil(count / perPage),
            data: compounds
          });
        });
      });
  },

  list: async (req, res, next) => {
    const compounds = await Compound.find({}).select("compound_id cname");
    if (!compounds) {
      res.status(404).json({
        success: false,
        message: "did not find any compounds"
      });
    }

    res.status(200).json({
      success: false,
      message: "show all list compounds are success",
      length: compounds.length,
      data: compounds
    });
  },

  detailCompound: async (req, res, next) => {
    const idcompound = req.params.idcompound;

    Compound.findById(idcompound)
      .populate("refPlant")
      .populate("refCrudeCompound")
      .exec()
      .then(compound => {
        if (!compound) {
          res.status(404).json({
            success: false,
            message: "Detail compound not found"
          });
        }

        res.status(200).json({
          success: true,
          message: "Detail compound success",
          data: compound
        });
      })
      .catch(err => {
        console.log(err);
      });
  },

  create: async (req, res, next) => {
    var {
      compound_id,
      cname,
      effect_compound,
      pubchem_ID,
      knapsack_ID,
      chemspider_ID,
      other_ID,
      note,
      ref_effect,
      refCrudeCompound,
      refPlant
    } = req.value.body;

    const newCompound = new Compound({
      compound_id: compound_id,
      cname: cname,
      effect_compound: effect_compound,
      pubchem_ID: pubchem_ID,
      knapsack_ID: knapsack_ID,
      chemspider_ID: chemspider_ID,
      other_ID: other_ID,
      note: note,
      ref_effect: ref_effect,
      refCrudeCompound: null,
      refPlant: refPlant
    });
    await newCompound.save();

    if (newCompound) {
      res.status(201).json({
        success: true,
        message: "new compound is created",
        data: newCompound
      });
    }
  },

  search: async (req, res, next) => {
    // const term =req.query.search;
    // console.log(req.query.search);
    const term = req.query.search;
    // console.log(term);

    await Compound.find(
      {
        cname: {
          $regex: new RegExp(term, "i")
        }
      },
      {
        __v: 0
      },
      function(err, data) {
        res.json({
          success: true,
          message: "show searchs",
          data: data
        });
      }
    ).populate("refPlant");
  },

  update: async (req, res, next) => {
    const idcompound = req.params.idcompound;
    Compound.findByIdAndUpdate(
      idcompound,
      {
        cname: req.body.cname,
        effect_compound: req.body.effect_compound,
        pubchem_ID: req.body.pubchem_ID,
        knapsack_ID: req.body.knapsack_ID,
        chemspider_ID: req.body.chemspider_ID,
        other_ID: req.body.other_ID,
        note: req.body.note,
        ref_effect: req.body.ref_effect,
        refCrudeCompound: null,
        refPlant: req.body.refPlant
      },
      { new: true },
      function(err, compound) {
        if (!compound) {
          return res.json({
            success: false,
            message: "there is no compound"
          });
        }
        if (err) {
          return res.json({
            success: false,
            message: "Updated compound failed"
          });
        }

        res.json({
          success: true,
          message: "Successful updated compound",
          data: compound
        });
      }
    );
  },

  delete: async (req, res, next) => {
    const idcompound = req.params.idcompound;
    // var compound = await Compound.findById(idcompound);
    // if(!compound){
    //     res.json({
    //         success: false,
    //         message: 'Deleted compound failed'
    //     });
    // }else{
    //     await compound.delete();

    //     res.json({
    //         success: true,
    //         message: 'Deleted compound success'
    //     });
    // }

    await Compound.findByIdAndRemove(idcompound)
      .exec()
      .then(result => {
        if (!result) {
          return res.status(200).json({
            success: false,
            message: "Delete compound error / id did not found"
          });
        }
        res.status(200).json({
          success: true,
          message: "Delete compound success"
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
