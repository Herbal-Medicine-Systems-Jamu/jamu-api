const Tacit = require("../models/tacit");
var fs = require("fs");
var path = require("path");

module.exports = {
  all: async (req, res, next) => {
    const isVerified = true;
    await Tacit.find({ isVerified })
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
    const isVerified = true;
    var perPage = 10;
    var page = req.params.page || 1;

    await Tacit.find({ isVerified })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .select("-__v")
      .exec(function(err, tacits) {
        Tacit.count().exec(function(err, count) {
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
    const isVerified = true;
    const tacits = await Tacit.find({ isVerified }).select("title");
    if (!tacits) {
      res.status(404).json({
        success: false,
        message: "did not find any tacits "
      });
    }
    res.status(200).json({
      success: true,
      message: "show all tacits are success",
      lenght: tacits.length,
      data: tacits
    });
  },

  detail: async (req, res, next) => {
    const id = req.params.id;

    var tacit = await Tacit.findById(id).select("-__v");

    if (!tacit) {
      res.status(404).json({
        success: false,
        message: "didn't find any tacit"
      });
    } else {
      res.json({
        success: true,
        message: "Detail tacit read",
        data: tacit
      });
    }
  },

  getFile: async (req, res, next) => {
    const file = req.params.file;
    res.sendFile(path.join(__dirname, "../public/files/tacit/" + file));
  },

  create: async (req, res, next) => {
    var user = req.user;

    if (user.roles == "user") {
      var isVerified = false;
    } else {
      isVerified = true;
    }

    var file = "";
    if (req.file) {
      fs.unlink(path.join(__dirname, "../public/files/tacit/" + file), function(
        error
      ) {
        if (error) {
          console.log(error);
        }
      });
      file = req.file.filename;
    }

    const newTacit = new Tacit({
      title: req.body.title,
      content: req.body.content,
      reference: req.body.reference,
      datePublish: req.body.datePublish,
      file: file,
      user_id: user._id,
      isVerified: isVerified
    });

    await newTacit.save();

    res.status(201).json({
      success: true,
      message: "New tacit is created",
      data: newTacit
    });
  },

  update: async (req, res, next) => {
    const id = req.params.id;
    var tacit = await Tacit.findById(id);
    if (!tacit) {
      res.json({
        success: false,
        message: "Updated tacit failed"
      });
    }
    var file = tacit.file;

    if (req.file) {
      fs.unlink(path.join(__dirname, "../public/files/tacit/" + file), function(
        error
      ) {
        if (error) {
          console.log(error);
        }
      });
      file = req.file.filename;
    }

    tacit.title = req.body.title;
    tacit.content = req.body.content;
    tacit.reference = req.body.reference;
    tacit.datePublish = req.body.datePublish || Date.now();
    tacit.file = file;
    await tacit.save();

    res.status(201).json({
      success: true,
      message: "Tacit updated",
      data: tacit
    });
  },

  delete: async (req, res, next) => {
    const id = req.params.id;
    var tacit = await Tacit.findById(id);
    if (!tacit) {
      res.json({
        success: false,
        message: "Deleted tacit failed"
      });
    } else {
      fs.unlink(
        path.join(__dirname, "../public/files/tacit/" + tacit.file),
        function(error) {
          if (error) {
            console.log(error);
          }
        }
      );

      await tacit.delete();

      res.json({
        success: true,
        message: "Deleted tacit success"
      });
    }
  },

  setVerif: async (req, res, next) => {
    const id = req.params.id;
    var tacit = await Tacit.findById(id);
    if (!tacit) {
      res.json({
        success: false,
        message: "Updated tacit failed"
      });
    }

    tacit.isVerified = true;
    await tacit.save();

    res.status(201).json({
      success: true,
      message: "Tacit updated",
      data: tacit
    });
  },

  getByVerif: async (req, res, next) => {
    const isVerified = req.params.status;
    var tacit = await Tacit.find({ isVerified }).select("-__v");
    if (!tacit) {
      res.json({
        success: false,
        message: "Updated tacit failed"
      });
    }

    res.status(201).json({
      success: true,
      message: "Tacit updated",
      data: tacit
    });
  },

  sort: async (req, res, next) => {
    // const term =req.body.search;
    // let sort_date = req.body.date;
    // let name = req.body.name;

    const term = req.query.search;
    let sort_date = req.query.date;
    let name = req.query.name;

    let sort = {};
    console.log(term, sort_date, name);
    if (name === "asc") {
      Object.assign(sort, { title: 1 });
    } else if (name === "desc") {
      Object.assign(sort, { title: -1 });
    }

    if (sort_date === "asc") {
      Object.assign(sort, { datePublish: 1 });
    } else if (sort_date === "desc") {
      Object.assign(sort, { datePublish: -1 });
    }

    Tacit.find(
      {
        // deal_id:deal._id // Search Filters
        title: {
          $regex: new RegExp(term, "i")
        }
      },
      {
        // _id:0,
        __v: 0
      },
      // ['type','date_added'], // Columns to Return
      {
        skip: 0, // Starting Row
        limit: 10, // Ending Row
        sort: sort
      },
      function(err, data) {
        res.json({
          success: true,
          message: "show searchs",
          data: data
        });
      }
    );
  }
};
