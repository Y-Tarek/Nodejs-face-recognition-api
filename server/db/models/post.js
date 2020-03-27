const mongoose = require('mongoose');
var PostSchema = new mongoose.Schema({
    type:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    gender:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },

    phone:{
        type:String,
        required:true,
        trim:true
    },
    address:{
        type:String,
        trim:true
    },
    main_image:{
        type:String,
        required:true
    },

    main_image_URL:{
        type:String,
        required:true
    },

    _creator:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },

    post_time:{
       type:String,
       trim:true,
       required:true,
       default:new Date().toISOString().slice(0,10)
    },

    time:{
        type:String,
        required:true,
        trim:true,
        default:null
    }
});

//Model creation
var Post = mongoose.model('Posts',PostSchema);
module.exports = {Post}