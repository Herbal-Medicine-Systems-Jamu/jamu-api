const User = require('../models/user');
const TokenMod = require('../models/token');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../configuration');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
var spawn = require('child_process').spawn;
const csv = require('fast-csv');
const Import = require('../models/import');
var fs = require('fs');
var path = require('path');
const mongoose = require('mongoose');
var db = mongoose.connection;
// const spawn = require("child_process").spawn;
// const sys   = require('sys');
// const pythonProcess = spawn('python',["../sci-jamu/deeplearning_fix"]);
let {PythonShell} = require('python-shell')
require('dotenv').config();

signToken = user => {
    return JWT.sign({
        iss: 'jamu',
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, JWT_SECRET);
}

module.exports = {
    import: async(req, res, next) => {
    //    console.log(req.file.filename);
    //    console.log(req.file);
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
            .fromStream(stream, {headers:true})
            .on("data", async function(data){
                
                var item = new Import({
                    idimport: data.idimport
                    // price: data[1],
                    // category: data[2],
                    // description: data[3],
                    // manufacturer:data[4] 
                });

                // console.log('id import ', data.idimport);
                // console.log('array ', data);
                
                await item.save(function(error){
                console.log(item);
                    if(error){
                        console.log (error);
                    }
                }); 

        }).on("end", function(){
                console.log(" End of file import");
        });

        // await stream.pipe(csvStream);
        res.json({success : "Data imported successfully.", status : 200});

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

    getitem: async(req, res, next) => {
        var idimport = '7373';
        const test = await Import.findOne({idimport});
        console.log(test);
    },

    pipe: async(req, res, next) => {
        fs.createReadStream("./controllers/import.csv")
        .fromStream({headers: true})
        .pipe(csv())
        .on("data", async function(data){
            // console.log(data);
            // let item = new Import({
            //     idimport: data.idimport
            // });
            // await item.save(function(error){
            // console.log(item);
            //     if(error){
            //         console.log (error);
            //     }
            // }); 

            console.log(data.idimport);
        })
        .on("end", function(){
            console.log("done");
            res.json({success : "Data imported successfully.", status : 200});
        });
    }


   
}