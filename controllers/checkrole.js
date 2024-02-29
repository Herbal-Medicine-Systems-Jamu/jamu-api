const User = require('../models/user');

module.exports = {
    adminpro: async(req, res, next) => {
        user = req.user;
        const roles = ['adminpro'];
        for(i=0; i<roles.length; i++){
            if(user.roles.includes(roles[i])){
              return next();
            }else{
                res.status(401).json({
                    id: user.id,
                    roles: user.roles,
                    success: false,
                    message: 'You are not authorized to view this content'
                });
            }
          }
        return next();
    },

    admin: async(req, res, next) => {
        user = req.user;
        const roles = ['admin', 'adminpro'];

        for(i=0; i<roles.length; i++){
            if(user.roles.includes(roles[i])){
                return next();
            }else{
                res.status(401).json({
                    success: false,
                    message: 'You are not authorized to view this content',
                    id: user.id,
                    roles: user.roles,
                    
                });
            }
          }
        
        return next(user);
    },

    user: async(req, res, next) => {
        user = req.user;
        const roles = ['user'];
        for(i=0; i<roles.length; i++){
            if(user.roles.includes(roles[i])){
              return next();
            }else{
                res.status(401).json({
                    id: user.id,
                    roles: user.roles,
                    success: false,
                    message: 'You are not authorized to view this content'
                });
            }
          }
    },

    isVerified: async(req, res, next) => {
        var email       = req.body.email;
        const user      = await User.findOne({email});
        if(!user){
            res.json({
                success: false,
                message: 'Your email or password are wrong'
            });
        }
        let checkVerif  = await user.isVerified;

        if(checkVerif === true){
            return next();
        }else{
            res.json({
                success: false,
                message: 'Please verify your email'
            });
        }
    }

}