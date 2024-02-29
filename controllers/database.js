const User = require('../models/user');
const Import = require('../models/import');
const Plant = require('../models/plant');
const Company = require('../models/company');
const Combination = require('../models/combination');
const Crudedrug = require('../models/crudedrug');
const Dclass = require('../models/dclass');
const Ethnic = require('../models/ethnic');
const Explicit = require('../models/explicit');
const Herbsmed = require('../models/herbsmed');
const Medtype = require('../models/medtype');
const Plantcrude = require('../models/plantcrude');
const Plantethnic = require('../models/plantethnic');
const Province = require('../models/province');
const Refformula = require('../models/refformula');
const Tacit = require('../models/tacit');

const TokenMod = require('../models/token');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../configuration');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
var spawn = require('child_process').spawn;
const csv = require('fast-csv');

var fs = require('fs');
var path = require('path');
const mongoose = require('mongoose');
var db = mongoose.connection;


module.exports = {
    deleteAllCollections: async(req, res, next) => {
        let delete_collection_list = ["companies", "crudedrugs", "combinations", 'dclasses', "ethics", "explicits", "herbsmeds", "medtypes", "plantcrudes", "plantethnics", "plants", "provinces", "refformulas", "tacits", "imports"]

        delete_collection_list.forEach( function (collection) {
            db.dropCollection(collection, function(err, result) {
                    if(err){
                        console.log('cant find table ', collection);
                    }                 
                });
        })
        return res.json({
            success: true,
            message:'deleted all database successful'
        });

    },

    plant: async(req, res, next) => {
       var stream = fs.createReadStream(req.file.path);
       let i = 0;
       var csvStream = csv
           .fromStream(stream, {headers:true})
           .on("data", async function(data){
               
               var item = new Plant({
                   idplant  : data.idplant,
                   sname    : data.sname,
                   refimg   : data.refimg
               });
               
               await item.save(function(error){
                   if(error){
                       console.log (error);
                   }
                //    console.log(i++);
               }); 

       }).on("end", function(){
            console.log(" End of file import");
            fs.unlink(path.join(__dirname, '../public/files/data/import/' + req.file.filename), function(error) {
                if (error) {
                    console.log(error);
                }
            });

            res.json({success : "Data plant imported successfully.", status : 200});
       });
    },

    company: async(req, res, next) => {
        var stream = fs.createReadStream(req.file.path);
        let i = 0;
        var csvStream = csv
            .fromStream(stream, {headers:true})
            .on("data", async function(data){
                
                var item = new Company({
                    idcompany   : data.idcompany,
                    cname       : data.cname,
                    address     : data.address,
                    city        : data.city,
                    country     : data.country,
                    postcode    : data.postcode,
                    contact     : data.contact,
                    url         : data.url
                });
                
                await item.save(function(error){
                    if(error){
                        console.log (error);
                    }
                    // console.log(i++);
                }); 
 
        }).on("end", function(){
             console.log(" End of file import");
             fs.unlink(path.join(__dirname, '../public/files/data/import/' + req.file.filename), function(error) {
                 if (error) {
                     console.log(error);
                 }
             });
 
             res.json({success : "Data company imported successfully.", status : 200});
        });
     },

     combination: async(req, res, next) => {
        var stream = fs.createReadStream(req.file.path);
        let i = 0;
        var csvStream = csv
            .fromStream(stream, {headers:true})
            .on("data", async function(data){
                
                var item = new Combination({
                    idrefformula    : data.idrefformula,
                    idherbsmed      : data.idherbsmed,
                    idcrude         : data.idcrude,
                    composition     : data.composition,
                    unit            : data.unit
                });
                
                await item.save(function(error){
                    if(error){
                        console.log (error);
                    }
                    console.log(i++);
                }); 
 
        }).on("end", function(){
             console.log(" End of file import");
             fs.unlink(path.join(__dirname, '../public/files/data/import/' + req.file.filename), function(error) {
                 if (error) {
                     console.log(error);
                 }
             });
 
             res.json({success : "Data combination imported successfully.", status : 200});
        });
     },

     crudedrug: async(req, res, next) => {
        var stream = fs.createReadStream(req.file.path);
        let i = 0;
        var csvStream = csv
            .fromStream(stream, {headers:true})
            .on("data", async function(data){
                
                var item = new Crudedrug({
                    idcrude    : data.idcrude,
                    sname      : data.sname,
                    name_en    : data.name_en,
                    name_loc1  : data.name_loc1,
                    name_loc2  : data.name_loc2,
                    gname      : data.gname,
                    position   : data.position,
                    effect     : data.effect,
                    effect_loc : data.effect_loc,
                    comment    : data.comment,
                    ref        : data.ref
                });
                
                await item.save(function(error){
                    if(error){
                        console.log (error);
                    }
                    // console.log(i++);
                }); 
 
        }).on("end", function(){
             console.log(" End of file import");
             fs.unlink(path.join(__dirname, '../public/files/data/import/' + req.file.filename), function(error) {
                 if (error) {
                     console.log(error);
                 }
             });
 
        });

        res.json({success : "Datas crudedrug imported successfully.", status : 200});
     },

     dclass: async(req, res, next) => {
        var stream = fs.createReadStream(req.file.path);
        let i = 0;
        var csvStream = csv
            .fromStream(stream, {headers:true})
            .on("data", async function(data){
                
                var item = new Dclass({
                    idclass    : data.idclass,
                    class      : data.class,
                    description: data.description,
                    diseases   : data.diseases,
                    ref        : data.ref
                });
                
                await item.save(function(error){
                    if(error){
                        console.log (error);
                    }
                    i++;
                }); 
 
        }).on("end", function(){
             console.log(" End of file import");
            //  console.log(i);
             fs.unlink(path.join(__dirname, '../public/files/data/import/' + req.file.filename), function(error) {
                 if (error) {
                     console.log(error);
                 }
             });
 
        });

        res.json({success : "Datas dclass imported successfully.", status : 200});
     },

     ethnic: async(req, res, next) => {
        var stream = fs.createReadStream(req.file.path);
        let i = 0;
        var csvStream = csv
            .fromStream(stream, {headers:true})
            .on("data", async function(data){
                
                var item = new Ethnic({
                    name    : data.name
                });
                
                await item.save(function(error){
                    if(error){
                        console.log (error);
                    }
                    // console.log (i++);
                }); 
 
        }).on("end", function(){
             console.log(" End of file import");
             console.log(i);
             fs.unlink(path.join(__dirname, '../public/files/data/import/' + req.file.filename), function(error) {
                 if (error) {
                     console.log(error);
                 }
             });
 
        });

        res.json({success : "Datas ethnic imported successfully.", status : 200});
     },

     herbsmed: async(req, res, next) => {
        var stream = fs.createReadStream(req.file.path);
        let i = 0;
        var csvStream = csv
            .fromStream(stream, {headers:true})
            .on("data", async function(data){
                
                var item = new Herbsmed({
                    idherbsmed  : data.idherbsmed,
                    name        : data.name,
                    nameloc1    : data.nameloc1,
                    nameloc2    : data.nameloc2,
                    efficacy    : data.efficacy,
                    efficacyloc : data.efficacyloc,
                    ref         : data.ref,
                    idclass     : data.idclass,
                    idcompany   : data.idcompany,
                    idtype      : data.idtype,
                    img         : data.img
                });
                
                await item.save(function(error){
                    if(error){
                        console.log (error);
                    }
                    // console.log (i++);
                }); 
 
        }).on("end", function(){
             console.log(" End of file import");
             console.log(i);
             fs.unlink(path.join(__dirname, '../public/files/data/import/' + req.file.filename), function(error) {
                 if (error) {
                     console.log(error);
                 }
             });
 
        });

        res.json({success : "Datas herbsmed imported successfully.", status : 200});
     },

     plantcrude: async(req, res, next) => {
        var stream = fs.createReadStream(req.file.path);
        var csvStream = csv
            .fromStream(stream, {headers:true})
            .on("data", async function(data){
                
                var item = new Plantcrude({
                    idplant : data.idplant,
                    idcrude : data.idcrude
                });
                
                await item.save(function(error){
                    if(error){
                        console.log (error);
                    }
                }); 
 
        }).on("end", function(){
             console.log(" End of file import");
             fs.unlink(path.join(__dirname, '../public/files/data/import/' + req.file.filename), function(error) {
                 if (error) {
                     console.log(error);
                 }
             });
 
        });

        res.json({success : "Datas plantcrude imported successfully.", status : 200});
     },

     refformula: async(req, res, next) => {
        var stream = fs.createReadStream(req.file.path);
        var csvStream = csv
            .fromStream(stream, {headers:true})
            .on("data", async function(data){
                
                var item = new Refformula({
                    idformula   : data.idformula,
                    idherbsmed  : data.idherbsmed,
                    ref         : data.ref
                });
                
                await item.save(function(error){
                    if(error){
                        console.log (error);
                    }
                }); 
 
        }).on("end", function(){
             console.log(" End of file import");
             fs.unlink(path.join(__dirname, '../public/files/data/import/' + req.file.filename), function(error) {
                 if (error) {
                     console.log(error);
                 }
             });
 
        });

        res.json({success : "Datas refformula imported successfully.", status : 200});
     },

     medtype: async(req, res, next) => {
        var stream = fs.createReadStream(req.file.path);
        var csvStream = csv
            .fromStream(stream, {headers:true})
            .on("data", async function(data){
                
                var item = new Medtype({
                    idtype: data.idtype,
                    medname  : data.medname
                });
                
                await item.save(function(error){
                    if(error){
                        console.log (error);
                    }
                }); 
                
 
        }).on("end", function(){
             console.log(" End of file import");
             fs.unlink(path.join(__dirname, '../public/files/data/import/' + req.file.filename), function(error) {
                 if (error) {
                     console.log(error);
                 }
             });
 
        });

        res.json({success : "Datas medtype imported successfully.", status : 200});
     },

    import: async(req, res, next) => {
     combinations = await Refformula.find({});
     console.log(combinations.length);

    },

    pipe: async(req, res, next) => {
        fs.createReadStream("./controllers/import.csv")
        .fromStream({headers: true})
        .pipe(csv())
        .on("data", async function(data){
            console.log(data.idimport);
        })
        .on("end", function(){
            console.log("done");
            res.json({success : "Data imported successfully.", status : 200});
        });
    }


   
}