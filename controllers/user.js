const User = require("../models/user");
const TokenMod = require("../models/token");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../configuration");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
const csv = require("fast-csv");
const Import = require("../models/import");
var fs = require("fs");
const Dclass = require("../models/dclass");

require("dotenv").config();

signToken = user => {
  return JWT.sign(
    {
      iss: "jamu",
      sub: user.id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 60)
    },
    JWT_SECRET
  );
};

module.exports = {
  signUp: async (req, res, next) => {
    var { email, password, name, roles } = req.value.body;
    const checkUser = await User.findOne({ email });
    if (!roles) {
      roles = "user";
    }
    if (checkUser) {
      return res.status(403).json({
        error: "Email is already in use"
      });
    }

    // create new user
    const newUser = await new User({ email, password, name, roles });
    await newUser.save();

    // Create a verification token for this user
    var token = new TokenMod({
      _userid: newUser._id,
      token: crypto.randomBytes(16).toString("hex")
    });

    // Save the verification token
    await token.save(function(err) {
      if (err) {
        return res.status(500).send({
          success: false,
          message: err.message
        });
      }

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const message = {
        to: newUser.email,
        from: "no-reply@jamuipb.com",
        subject: "Account Verification Token",
        text:
          "Hello,\n\n" +
          "Please verify your account by clicking the link: \nhttp://" +
          req.headers.host +
          "/jamu/api/user/confirmation/" +
          token.token +
          ".\n"
      };
      sgMail.send(message, function(err) {
        if (err) {
          return res.status(500).send({ message: err.message });
        }

        res.status(200).json({
          success: true,
          message: "A verification email has been sent to " + newUser.email
        });
      });
    });
  },

  signIn: async (req, res, next) => {
    const token = signToken(req.user);
    res.status(200).json({
      success: true,
      message: "sign in as user is success",
      data: {
        _id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        roles: req.user.roles
      },
      token
    });
  },

  confirmation: async (req, res, next) => {
    const token = req.params.token;

    // Find a matching token
    TokenMod.findOne({ token }, function(err, token) {
      if (!token)
        return res.status(400).send({
          success: false,
          type: "not-verified",
          message:
            "We were unable to find a valid token. Your token my have expired."
        });

      User.findOneAndUpdate(
        { _id: token._userid },
        { isVerified: true },
        { new: true },
        function(err, user) {
          if (err) {
            return res.json({ success: false, message: err });
          }
          if (!user)
            return res.status(400).send({
              success: false,
              message: "We were unable to find a user for this token."
            });

          if (user.isVerified)
            return res.status(400).send({
              success: true,
              type: "already-verified",
              message: "This user has already been verified."
            });

          res.json({
            success: true,
            message: "The account has been verified. Please log in."
          });
        }
      );
    });
  },

  resendToken: async (req, res, next) => {
    const email = req.body.email;

    User.findOne({ email }, function(err, user) {
      if (!user)
        return res.status(400).send({
          success: false,
          message: "please fill email correctly"
        });
      if (user.isVerified)
        return res.status(400).send({
          success: false,
          message: "This account has already been verified. Please log in."
        });

      var token = new TokenMod({
        _userid: user._id,
        token: crypto.randomBytes(16).toString("hex")
      });
      token.save(function(err) {
        if (err) {
          return res.status(500).send({
            success: false,
            message: err.message
          });
        }

        // Send the email
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const message = {
          to: user.email,
          from: "no-reply@jamuipb.com",
          subject: "Account Verification Token",
          text:
            "Hello,\n\n" +
            "Please verify your account by clicking the link: \nhttp://" +
            req.headers.host +
            "/jamu/api/user/confirmation/" +
            token.token +
            ".\n"
        };
        sgMail.send(message, function(err) {
          if (err) {
            return res.status(500).send({ message: err.message });
          }
          res.status(200).json({
            success: true,
            message: "A verification email has been sent to " + user.email
          });
        });
      });
    });
  },

  getUser: async (req, res, next) => {
    res.status(200).json({
      success: true,
      message: "get data user",
      data: {
        _id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        roles: req.user.roles
      }
    });
  },

  update: async (req, res, next) => {
    var _id = req.user.id;
    User.findByIdAndUpdate(
      { _id },
      {
        name: req.body.name
      },
      { new: true },
      function(err, newUser) {
        if (err) {
          return res.json({
            success: false,
            message: "Update User failed. " + err
          });
        }
        res.json({
          success: true,
          message: "Successful updated user.",
          data: {
            _id: newUser.id,
            email: newUser.email,
            name: newUser.name
          }
        });
      }
    );
  },

  changePassword: async (req, res, next) => {
    if (!req.user.id) {
      res.json({
        success: false,
        message: "there is no id"
      });
    }
    var { old_password, new_password } = req.value.body;
    var id = req.user.id;
    var user = await User.findById(id, function(err, data) {
      if (err) {
        return res.json({
          success: false,
          message: "User find by id failed. " + err
        });
      }
      return data;
    });

    const isMatch = await user.isValidPassword(old_password);
    // if not, handle it
    if (!isMatch) {
      // return done(null, false) ;
      // return );
      return res.json({
        success: false,
        message: "please fill ur password correctly"
      });
    } else {
      user.password = new_password;
      await user.save();
      return res.json({
        success: true,
        message: "change password success"
      });
    }
  },

  import: async (req, res, next) => {
    //    console.log(req.file.filename);
    //    console.log(req.file);
    // db.imports.remove({});
    // import.remove({});

    // db.dropCollection("imports", function (err, result) {

    //     if (err) {

    //         console.log("error delete collection");

    //     } else {

    //         console.log("delete collection success");

    //     }

    // });
    var stream = fs.createReadStream("./controllers/import.csv");

    // csv
    // .fromStream(stream)
    // .on("data", function(data){
    //     console.log(data);
    // })
    // .on("end", function(){
    //     console.log("done");
    // });

    // var  products  = []

    var csvStream = csv
      .fromStream(stream, { headers: true })
      .on("data", async function(data) {
        var item = new Import({
          idimport: data.idimport
          // price: data[1],
          // category: data[2],
          // description: data[3],
          // manufacturer:data[4]
        });

        // console.log('id import ', data.idimport);
        // console.log('array ', data);

        await item.save(function(error) {
          console.log(item);
          if (error) {
            console.log(error);
          }
        });
      })
      .on("end", function() {
        console.log(" End of file import");
      });

    // await stream.pipe(csvStream);
    res.json({ success: "Data imported successfully.", status: 200 });

    //    fs.unlink(path.join(__dirname, '../public/files/import/' + req.file.filename), function(error) {
    //     if (error) {
    //         console.log(error);
    //     }
    // });

    // var authorFile = req.file.path;

    // var authors = [];

    // csv
    //  .fromString(stream.data.toString(), {
    // 	 headers: true,
    // 	 ignoreEmpty: true
    //  })
    //  .on("data", function(data){
    // 	 data['_id'] = new mongoose.Types.ObjectId();

    // 	 authors.push(data);
    //  })
    //  .on("end", function(){
    // 	 Import.create(authors, function(err, documents) {
    // 		if (err) throw err;
    // 	 });

    // 	 res.send(authors.length + ' authors have been successfully uploaded.');
    //  });
  },

  getitem: async (req, res, next) => {
    var idimport = "7373";
    const test = await Import.findOne({ idimport });
    console.log(test);
  },

  secret: async (req, res, next) => {
    console.log(req.query)
    let id = req.query.id;
    let type = req.query.type;
    let model = req.query.model;
    let optimization = req.query.optimization;

    const plant_data = require("./plant_data");
    const compound_data = require("./compound_data")

    function getId() {
      return new Promise(resolve => {
        let arr = [];

        if (type === "crude") {
          id.forEach(id => {
            plant_data.forEach(dt => {
              if (dt.ID_Knapsack === id) {
                arr.push(dt.IDPlant);
              }
            });
          });
        } else if (type === "compound") {
          id.forEach(id => {
            compound_data.forEach(dt => {
              if (dt.id_in_db === id) {
                arr.push(dt.id_in_model);
              }
            });
          });
        }
        
        resolve(arr);
      });
    }

    let arr = await getId();
    console.log(arr);

    const path = require("path");
    const { spawn } = require("child_process");
    /**
     * Run python3 script, pass in `-u` to not buffer console output
     * @return {ChildProcess}
     */
    let process;
    if (type === "crude") {
      switch (model) {
        case "svm":
          if (optimization === "0") {
            process = spawn("python3", [
              path.join(__dirname, "svm_optimization.py"),
              arr
            ]);
          } else if (optimization === "1") {
            process = spawn("python3", [
              path.join(__dirname, "svm_not_optimization.py"),
              arr
            ]);
          }
          break;
        case "rf":
          if (optimization === "0") {
            process = spawn("python3", [
              path.join(__dirname, "rf_optimization.py"),
              arr
            ]);
          } else if (optimization === "1") {
            process = spawn("python3", [
              path.join(__dirname, "rf_not_optimization.py"),
              arr
            ]);
          }
          break;
        case "dl":
          if (optimization === "0") {
            process = spawn("python3", [
              path.join(__dirname, "dl_optimization.py"),
              arr
            ]);
          } else if (optimization === "1") {
            process = spawn("python3", [
              path.join(__dirname, "dl_not_optimization.py"),
              arr
            ]);
          }
          break;
      }
    } else if (type === "compound") {
      switch (model) {
        case "dnn":
          if (optimization === "0") {
            process = spawn("python3", [path.join(__dirname, "c_dnn_not_optimization.py"), arr]);
          } else if (optimization === "1") {
            process = spawn("python3", [path.join(__dirname, "c_dnn_optimization.py"), arr]);
          }
          break;
        case "rf":
          if (optimization === "0") {
            process = spawn("python3", [path.join(__dirname, "c_rf_not_optimization.py"), arr]);
          } else if (optimization === "1") {
            process = spawn("python3", [path.join(__dirname, "c_rf_optimization.py"), arr]);
          }
          break;
        case "lgbm":
          if (optimization === "0") {
            process = spawn("python3", [path.join(__dirname, "c_lgbm_not_optimization.py"), arr]);
          } else if (optimization === "1") {
            process = spawn("python3", [path.join(__dirname, "c_lgbm_optimization.py"), arr]);
          }
          break;
      }
    }

    process.stdout.on("data", data => {
      console.log(`stdout: ${data}`);
    });

    process.stderr.on("data", data => {
      console.log(`stderr: ${data}`);
    });

    process.on("close", code => {
      console.log(`child process exited with code ${code}`);
    });

    process.stdout.on("data", async data => {
      data = data.toString();
      data = data.replace("[", "");
      idclass = data.replace("]", "");
      idclass = parseInt(idclass, 10);
      const dclass = await Dclass.findOne({ idclass });
      console.log(dclass);
      return res.json({
        success: true,
        message: "dclass are found",
        data: dclass
      });
    });
  }
};
