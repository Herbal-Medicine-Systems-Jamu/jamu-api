const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { JWT_SECRET } = require('.');
const User = require('../models/user');

// JSON WEB TOKEN STRATEGY
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async(payload, done) => {
    try{
        
        const user = await User.findById(payload.sub);
        
        //if user doesn't exists, handle it
        if(!user){
            return done(null, false);
        }
        return done(null, user);
        
    }catch(error){
        done(error, false);
    }
}));

//LOCAL STRATEGY
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async(email, password, done) => {
    try{
        
        const user = await User.findOne({email});

        // if not, handle it
        if(!user){
            return done(null, false, {"message": "User not found."});
        }else{
            const isMatch = await user.isValidPassword(password);
            // if not, handle it
            if(!isMatch){
                return done(null, false) ;
                // return );
            }else{
                // otherwise, resturn the user
                done(null, user);
            }            
        }
    }catch(error){
        return done(null, false, {"message": "User not found."});
    }
    
}));