const Explicit = require('../models/explicit');
var fs = require('fs');
var path = require('path');

module.exports = {
    index: async(req, res, next) => {
        var perPage = 10
        var page = req.params.page || 1
        
        await Explicit
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .select('-__v')
        .exec(function(err, explicits) {
            Explicit.count().exec(function(err, count) {
                if (err) return next(err)
                res.status(200).json({
                    success: true,
                    message: 'show all explicits are success',
                    lenght: explicits.length,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    data: explicits,
                    
                });
            })
        });    
    },

    list: async(req, res, next) => {
        const explicits = await Explicit.find({}).select('title description');
        if(!explicits){
            res.status(404).json({
                success: false,
                message: 'did not find any explicits '
            });
        }
        res.status(200).json({
            success: true,
            message: 'show all explicits are success',
            lenght: explicits.length,
            data: explicits
        });
    },
    
    detail: async(req, res, next) => {
        
        const id = req.params.id;
        
        var explicit = await Explicit
                            .findById(id)
                            .select('-__v')

        if(!explicit){
            res.status(404).json({
                success: false,
                message: "didn't find any explicit"
            })
        }else{
            res.json({
                success: true,
                message: "Detail explicit read",
                data: explicit
            });
        }
    },

    getFile: async(req, res, next) => {
        const file = req.params.file;
        res.sendFile(path.join(__dirname, '../public/files/explicit/' + file));
    },

    create: async(req, res, next) => {
        const user = req.user;
        var datetime = new Date();      
        const newExplicit = new Explicit({
            firstName   : req.body.firstName,
            lastName    : req.body.lastName,
            title       : req.body.title,
            datePublish : req.body.datePublish,
            publisher   : req.body.publisher,
            citation    : req.body.citation,
            language    : req.body.language,
            abstract    : req.body.abstract,
            description : req.body.description,
            file        : req.file.filename,
            user_id     : user._id,
            created_at  : datetime,
            updated_at  : datetime
        });
        
        await newExplicit.save();
        
        res.status(201).json({
            success: true,
            message: 'New explicit is created',
            data: newExplicit
        });
    },

    update: async(req, res, next) => {
        const id = req.params.id;
        var explicit = await Explicit.findById(id);
        var datetime = new Date();
        if(!explicit){
            res.json({
                success: false, 
                message: 'Updated explicit failed'
            });
        }
        var file = explicit.file;
        
        if(req.file){
            fs.unlink(path.join(__dirname, '../public/files/explicit/' + file), function(error) {
                if (error) {
                    console.log(error);
                }
            });
            file = req.file.filename;
            
        }
       
        explicit.firstName   = req.body.firstName;
        explicit.lastName    = req.body.lastName;
        explicit.title       = req.body.title;
        explicit.datePublish = req.body.datePublish;
        explicit.publisher   = req.body.publisher;
        explicit.citation    = req.body.citation;
        explicit.language    = req.body.language;
        explicit.abstract    = req.body.abstract;
        explicit.description = req.body.description;
        explicit.file        = file;
        explicit.updated_at  = datetime;
        await explicit.save();

        res.status(201).json({
            success: true,
            message: 'Explicit updated',
            data: explicit
        });    
    },

    delete: async(req, res, next) => {
        const id = req.params.id;
        var explicit = await Explicit.findById(id);
        if(!explicit){
            res.json({
                success: false, 
                message: 'Deleted explicit failed'
            });
        }else{
            fs.unlink(path.join(__dirname, '../public/files/explicit/' + explicit.file), function(error) {
                if (error) {
                    console.log(error);
                }
            });

            await explicit.delete();

            res.json({
                success: true, 
                message: 'Deleted explicit success'
            });
        }
    },

    sort: async(req, res, next) => {
        //const term =req.body.search;
        // let sort_date = req.body.date;
        // let name = req.body.name;

        const term = req.query.search;
        let sort_date = req.query.date;
        let name = req.query.name;
        
        let sort = {}
        console.log(term,sort_date,name)
        if(name === 'asc' ){
            Object.assign(sort, {title: 1});
        }else if(name === 'desc'){
            Object.assign(sort, {title: -1});
        }

        if(sort_date === 'asc'){
            Object.assign(sort, {created_at: 1});
        }else if(sort_date === 'desc'){
            Object.assign(sort, {created_at: -1});
        }

        Explicit.find({
            // deal_id:deal._id // Search Filters
            title: {
                $regex: new RegExp(term, "i")
            }
        },{
            //_id:0,
            __v: 0
        },
        // ['type','date_added'], // Columns to Return
        {
            skip:0, // Starting Row
            limit:10, // Ending Row
            sort:(sort)
        },
        function(err, data){
            res.json({
                success: true,
                message: 'show searchs',
                data: data
            });
        })
          
    }

}