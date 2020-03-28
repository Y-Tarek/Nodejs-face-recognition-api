const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const randtoken = require('rand-token');

const UserSchema = new mongoose.Schema({
    UserName:{
        type:String,
        trim:true,
        index:true,
        required:true
    },

    phone:{
        type:String,
        required:true,
        unique:true
    },

    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        validate:{
            validator:(val) => {
                return validator.isEmail(val);
            },
            message:'{VALUE} is not a valid email'
        }
    },
 
    password:{
        type:String,
        required:true,
        trim:true
    },

    role:{
        type:String,
        default:"user",
        enum:["user","admin"]
    },


    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        },
    }]
   
});

// Instance Methods
   UserSchema.methods.generateAuthToken = function(){
       var user = this;
       var access = "auth";
       var token = jwt.sign({_id:user._id,access:access},process.env.JWT_SECRET);

        user.tokens.push({
        access:access,
        token:token,
        });
        return user.save().then(()=>{
            return token;
        });
   }

   UserSchema.methods.removeToken = function(token){
       var user = this;
          return user.updateOne({
              $pull:{
                  tokens:{
                      token:token
                  }
              }
          })
       
   }

// Model Methods
    UserSchema.statics.findByToken = function(token){
        var user = this;
        var decoded;
            try{
                decoded = jwt.verify(token,process.env.JWT_SECRET);
            }catch(e) {
                console.log(e);
                return Promise.reject();
            }

         return user.findOne({
             "_id":decoded,
             "tokens.token":token,
             "tokens.access":'auth',
         })

    }

    UserSchema.statics.findByCredintials = function(email,pass){
        var user = this;
        var con = email.indexOf('@') === -1 ? {UserName:email} : {email:email}
        var jsondata = JSON.stringify(con);
        var data = JSON.parse(jsondata);
      return  user.findOne(data).then((user) => {
            if(!user){
                return Promise.reject();
            }
            return new Promise((resolve,reject)=>{
                bcrypt.compare(pass,user.password,(err,res) => {
                  if(res){
                    resolve(user);
                  }else{
                    reject();
                  }
                })
              })
        })
        
    };
   
   
// Hash password in a Middle Ware
    UserSchema.pre('save',function(next)  {
        var user = this;
        if(user.isModified('password')){
            bcrypt.genSalt(10,(err,salt) => {
                bcrypt.hash(user.password,salt,(err,hash) => {
                    user.password = hash;
                    next();
                });
            })
        }else{
            next();
        }
    });


//Model creation
const user = mongoose.model("Users",UserSchema);
module.exports = {User:user}