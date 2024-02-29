const User = require("../models/user");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../configuration");

const HerbsMed = require("../models/herbsmed");
const Compound = require("../models/compound");
const Company = require("../models/company");
const CrudeDrug = require("../models/crudedrug");
const Plant = require("../models/plant");
const Dclass = require("../models/dclass");
const Ethnic = require("../models/ethnic");
const Explicit = require("../models/explicit");
const Medtype = require("../models/medtype");
const Plantethnic = require("../models/plantethnic");
const Tacit = require("../models/tacit");

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
    const { email, password, name, roles } = req.value.body;
    const isVerified = true;
    const checkUser = await User.findOne({ email });

    // if email found
    if (checkUser) {
      return res.status(403).json({
        error: "Email is already in use"
      });
    }

    // create admin
    const newUser = new User({ email, password, name, isVerified, roles });
    await newUser.save();

    const token = signToken(newUser);
    res.status(200).json({
      success: true,
      message: "Success admin created",
      token: token
    });
  },

  signIn: async (req, res, next) => {
    const token = signToken(req.user);
    // const user = req.user;

    res.status(200).json({
      success: true,
      message: "sign in successful",
      user: {
        _id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        roles: req.user.roles
      },
      token
    });
  },

  CountDB: async (req, res, next) => {
    let coutHerbsMed = await HerbsMed.count({});
    let countCompany = await Company.count({});
    let countCrudeDrug = await CrudeDrug.count({});
    let countPlant = await Plant.count({});
    let countDclass = await Dclass.count({});
    let countEthnic = await Ethnic.count({});
    let countExplicit = await Explicit.count({});
    let countMedtype = await Medtype.count({});
    let countPlantethnic = await Plantethnic.count({});
    let countTacit = await Tacit.count({});
    let countCompound = await Compound.count({});
    let countJamu = await HerbsMed.count({
      refMedtype: "5cf8d60119cb4513ec6d9298"
    });
    let countKampo = await HerbsMed.count({
      refMedtype: "5cf8d60119cb4513ec6d9299"
    });

    res.status(200).json({
      success: true,
      message: "shows all count database for dashbord",
      data: {
        coutHerbsMed: coutHerbsMed,
        countCompany: countCompany,
        countCrudeDrug: countCrudeDrug,
        countPlant: countPlant,
        countDclass: countDclass,
        countEthnic: countEthnic,
        countExplicit: countExplicit,
        countMedtype: countMedtype,
        countPlantethnic: countPlantethnic,
        countTacit: countTacit,
        countJamu: countJamu,
        countKampo: countKampo,
        countCompound: countCompound
      }
    });
  }
};
