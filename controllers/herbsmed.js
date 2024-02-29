const HerbsMed = require("../models/herbsmed");
const MedType = require("..//models/medtype");
var fs = require("fs");
var path = require("path");

module.exports = {
  search: async (req, res, next) => {
    // const term =req.body.search;
    const term = req.query.search;
    // console.log(term);
    // console.log(req.body.params.foo);

    await HerbsMed.find(
      {
        $or: [
          { name: { $regex: new RegExp(term, "i") } },
          { efficacy: { $regex: new RegExp(term, "i") } }
        ]
      },
      {
        _id: 0,
        __v: 0
      },
      function(err, data) {
        res.json({
          success: true,
          message: "show searchs",
          lenght: data.length,
          data: data
        });
      }
    )
      .populate("refCrude", "idcrude sname")
      .populate("refCompany", "idcompany cname")
      .populate("refDclass", "idclass class");
  },

  searchByType: async (req, res, next) => {
    let term = req.query.type;
    let search = req.query.search;
    term = term.charAt(0).toUpperCase() + term.slice(1);
    var perPage = 10;
    var page = req.query.page || 1;
    console.log(`term:${term},search:${search},page:${req.query.page}`);
    let refMedtype = await MedType.findOne({ medname: term }).then(data => {
      return data;
    });
    let HerbsMedLenght = await HerbsMed.find({
      $and: [
        {
          $or: [
            { name: { $regex: new RegExp(search, "i") } },
            { efficacy: { $regex: new RegExp(search, "i") } }
          ]
        },
        { refMedtype: refMedtype._id }
      ]
    }).then(data => {
      return data;
    });
    console.log(refMedtype);
    await HerbsMed.find({
      $and: [
        {
          $or: [
            { name: { $regex: new RegExp(search, "i") } },
            { efficacy: { $regex: new RegExp(search, "i") } }
          ]
        },
        { refMedtype: refMedtype._id }
      ]
    })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("refCrude", "idcrude sname")
      .populate("refCompany", "idcompany cname")
      .populate("refDclass", "idclass class")
      .populate("refMedtype", "idtype medname")
      .exec(function(err, herbsmeds) {
        if (err) return next(err);
        res.status(200).json({
          success: true,
          message: "show all jamu are success",
          lenght: herbsmeds.length,
          current: page,
          pages: Math.ceil(HerbsMedLenght.length / perPage),
          data: herbsmeds
        });
      });
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

    HerbsMed.find(
      {
        // deal_id:deal._id // Search Filters
        name: {
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
        sort: { name: name, created_at: sort_date }
      },
      function(err, data) {
        res.json({
          success: true,
          message: "show searchs",
          data: data
        });
      }
    )
      .populate("refCrude", "idcrude sname")
      .populate("reCompany", "idcompany cname")
      .populate("refDclass", "idclass class");
  },

  all: async (req, res, next) => {
    await HerbsMed.find({})
      .populate("refCrude", "idcrude sname")
      .populate("reCompany", "idcompany cname")
      .populate("refDclass", "idclass class")
      .exec(function(err, herbsmeds) {
        if (err) return next(err);

        res.status(200).json({
          success: true,
          message: "show all herbsmeds are success",
          lenght: herbsmeds.length,
          data: herbsmeds
        });
      });
  },

  index: async (req, res, next) => {
    var perPage = 10;
    var page = req.params.page || 1;
    await HerbsMed.find({})
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("refCrude", "idcrude sname")
      .populate("refCompany", "idcompany cname")
      .populate("refDclass", "idclass class")
      .populate("refMedtype", "idtype medname")
      .exec(function(err, herbsmeds) {
        HerbsMed.count().exec(function(err, count) {
          if (err) return next(err);
          res.status(200).json({
            success: true,
            message: "show all herbsmeds are success",
            lenght: herbsmeds.length,
            current: page,
            pages: Math.ceil(count / perPage),
            data: herbsmeds
          });
        });
      });
  },

  list: async (req, res, next) => {
    const herbsmeds = await HerbsMed.find({})
      .select("idherbsmed idtype name")
      .populate("refMedtype");

    return res.status(200).json({
      success: true,
      message: "show all herbsmed list",
      length: herbsmeds.length,
      data: herbsmeds
    });
  },

  listtype: async (req, res, next) => {
    let term = req.query.type;
    term = term.charAt(0).toUpperCase() + term.slice(1);
    var perPage = 10;
    var page = req.query.page || 1;
    let refMedtype = await MedType.findOne({ medname: term }).then(data => {
      return data;
    });
    let HerbsMedLenght = await HerbsMed.find({
      refMedtype: refMedtype._id
    }).then(data => {
      return data;
    });
    console.log(refMedtype);
    await HerbsMed.find({ refMedtype: refMedtype._id })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("refCrude", "idcrude sname")
      .populate("refCompany", "idcompany cname")
      .populate("refDclass", "idclass class")
      .populate("refMedtype", "idtype medname")
      .exec(function(err, herbsmeds) {
        if (err) return next(err);
        res.status(200).json({
          success: true,
          message: "show all jamu are success",
          lenght: herbsmeds.length,
          current: page,
          pages: Math.ceil(HerbsMedLenght.length / perPage),
          data: herbsmeds
        });
      });
  },

  detail: async (req, res, next) => {
    const idherbsmed = req.params.idherbsmed.toUpperCase();

    HerbsMed.findOne({ idherbsmed })
      .select("-__v")
      .populate("refCrude", "idcrude sname")
      .populate("refCompany")
      .populate("refDclass", "idclass class description")
      .populate("refMedtype", "idtype medname")
      .exec()
      .then(herbsmed => {
        if (!herbsmed) {
          res.status(404).json({
            success: false,
            message: "didn't find any herbsmed"
          });
        }

        // herbsmed.img = path.resolve(__dirname, '../public/images/herbsmed') + herbsmed.img;

        res.json({
          success: true,
          message: "Detail herbsmed read",
          data: herbsmed
        });
      })
      .catch(err => {
        console.log(err);
      });
  },

  getImage: async (req, res, next) => {
    const img = req.params.img;
    //res.sendFile(path.join(__dirname, "../public/images/herbsmed/" + img));
    res.setHeader("Content-Type", "application/jpg");
    fs.createReadStream(
      path.join(__dirname, "../public/images/herbsmed/" + img)
    ).pipe(res);
    // res.sendFile(path.join(__dirname, '../public/files/explicit/' + file));
  },

  create: async (req, res, next) => {
    var datetime = new Date();
    req
      .checkBody("idherbsmed")
      .notEmpty()
      .withMessage("Name field is required");
    idherbsmed = req.body.idherbsmed;
    idherbsmed = idherbsmed.toUpperCase();
    const checkIdHerbsmed = await HerbsMed.findOne({ idherbsmed });
    if (checkIdHerbsmed) {
      fs.unlink(req.file.path, function(error) {
        if (error) {
          throw error;
        }
      });

      return res.status(403).json({
        success: false,
        message: "Id HerbsMed is already in used"
      });
    }

    const newHerbsmed = new HerbsMed({
      idherbsmed: idherbsmed,
      name: req.body.name,
      nameloc1: req.body.nameloc1,
      nameloc2: req.body.nameloc2,
      efficacy: req.body.efficacy,
      efficacyloc: req.body.efficacyloc,
      ref: req.body.ref,
      idclass: req.body.idclass,
      idtype: req.body.idtype,
      idcompany: req.body.idcompany,
      img: req.body.img,
      refCompany: req.body.refCompany,
      refDclass: req.body.refDclass,
      refCrude: req.body.refCrude,
      refMedtype: req.body.refMedtype,
      img: req.file.filename,
      created_at: datetime,
      updated_at: datetime,
      user_id: req.user.id
    });
    await newHerbsmed.save();

    res.status(201).json({
      success: true,
      message: "New herbsmed is created",
      data: newHerbsmed
    });
  },

  update: async (req, res, next) => {
    const idherbsmed = req.params.idherbsmed.toUpperCase();

    var herbs = await HerbsMed.findOne({ idherbsmed });
    if (!herbs) {
      res.json({
        success: false,
        message: "Updated herbsmed failed"
      });
    }
    var img = herbs.img;
    if (req.file) {
      fs.unlink(
        path.join(__dirname, "../public/images/herbsmed/" + img),
        function(error) {
          if (error) {
            console.log(error);
          }
        }
      );
      img = req.file.filename;
    }

    console.log(`coba ${req.body.refCompany}`);

    herbs.name = req.body.name;
    herbs.nameloc1 = req.body.nameloc1;
    herbs.nameloc2 = req.body.nameloc2;
    herbs.efficacy = req.body.efficacy;
    herbs.efficacyloc = req.body.efficacyloc;
    herbs.ref = req.body.ref;
    herbs.idclass = req.body.idclass;
    herbs.idtype = req.body.idtype;
    herbs.idcompany = req.body.idcompany;
    herbs.img = req.body.img;
    herbs.refMedtype = req.body.refMedtype === "" ? null : req.body.refMedtype;
    herbs.refCompany = req.body.refCompany === "" ? null : req.body.refCompany;
    herbs.refDclass = req.body.refDclass === "" ? null : req.body.refDclass;
    herbs.refCrude = req.body.refCrude === "" ? null : req.body.refCrude;
    herbs.img = img;

    await herbs.save();

    res.json({
      success: true,
      message: "Successful updated herbsmed.",
      data: herbs
    });
  },

  delete: async (req, res, next) => {
    const idherbsmed = req.params.idherbsmed.toUpperCase();
    var herbs = await HerbsMed.findOne({ idherbsmed });
    if (!herbs) {
      res.json({
        success: false,
        message: "Deleted herbsmed failed"
      });
    } else {
      fs.unlink(
        path.join(__dirname, "../public/images/herbsmed/" + herbs.img),
        function(error) {
          if (error) {
            console.log(error);
          }
        }
      );

      await herbs.delete();

      res.json({
        success: true,
        message: "Deleted herbsmed success"
      });
    }
  }
};
