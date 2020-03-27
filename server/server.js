const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/config')
const {User} = require('./db/models/user');
const {Post} = require('./db/models/post');
const {mongoose} = require('./db/mongoose');
const {ObjectId} = require('mongodb');
const {authinticate}  = require('./MiddleWare/authintcate');
const {authorize} = require('./MiddleWare/authorize');
const multer  = require('./playground/multer');
const fr = require('face-recognition');
const {Hash} = require('./playground/hash');
const mail = require('./playground/mail');
const face_reco = require('./playground/face-recogntion');
const path = require('path');
const _ = require('lodash');
const cors = require('cors');
var app = express();
var  ip = require('ip');
var address = ip.address();
var fullAddress;
var  upload = multer.uploadFiles('./uploads');

//Express MiddleWare
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('uploads'));


//Authintcaion and authorization
app.post('/register',(req,res) => {
    var body = _.pick(req.body,['UserName','role','phone','email','password']);
    var newUser = new User(body);
    newUser.save().then(() => {
        return newUser.generateAuthToken();
    }).then((token)=>{
        //mail.sendEmail(body.email,"Welcome to black Mirror");
        res.header('Authorization', 'Bearer'+token).status(200).send(newUser);
    }).catch((e) => {res.status(400).send(e)})
})

app.post('/login',(req,res) => {
    var body = _.pick(req.body,['UserNameOrEmail','password']);
    User.findByCredintials(body.UserNameOrEmail,body.password).then((user) => {
        user.generateRefreshToken().then(() => {
            return user.generateAuthToken().then((token) => {
                res.header('Authorization', 'Bearer'+token).send(user);
            })
        })
    }).catch((e) => {res.status(404).send(e)});
})

app.delete('/logout',authinticate,(req,res) => {
  req.user.removeToken(req.token).then(() => {
      res.status(200).send();
  })
})

//User Services and prevliges
app.get('/profile',authinticate,(req,res) => {
    
    res.status(200).send(req.user);

})

app.get('/myPosts',authinticate,(req,res) => {
    Post.find({_creator:req.user._id}).then((posts) => {
        res.status(200).send({posts});
    }).catch((e) => {res.status(400).send(e)})
})

app.get('/mypost/:id',authinticate,(req,res) => {
    var id = req.params._id;
    if(!ObjectId.isValid(id)){
       return res.status(404).send()
    }
    Post.findOne({
        _id:id,
        _creator:req.user._id
    
    }).then((post) => {
        if(!post){
           return res.status(404).send()
        }
        res.status(200).send(post);
    })
})

app.post('/editProfile',authinticate,(req,res) => {
    var body = _.pick(req.body,['UserName','email','phone']);
    User.findOneAndUpdate({_id:req.user._id},{$set:body},{new:true}).then((updatedUser) => {
        if(!updatedUser){
            res.status(404).send()
        }
        res.status(200).send(updatedUser);
    }).catch((e) => {res.status(400).send(e)})
})

app.post('/post',upload.single(""),authinticate,(req,res) => {
    if(!req.file){
        res.status(400).send('No Image uploaded');
    }else{
        var post = new Post({
        type:req.body.type,
        name:req.body.name,
        gender:req.body.gender,
        age:req.body.age,
        phone:req.body.phone,
        address:req.body.address,
        _creator:req.user._id,
        main_image:req.file.path,
        main_image_URL:fullAddress+'/'+path.basename(req.file.path),
        time:req.body.time
        });
    
        post.save().then((newPost) => {
            if(!newPost){
                res.status(400).send();
            }
            res.status(200).send(newPost);
        }).catch((e) => {res.status(400).send(e)})
   }
})

app.post('/search/:gender&:type',upload.single(""),authinticate,(req,res) => {
    if(!req.file){
        return res.status(404).send("No file")
    }
    var serach_image = fr.loadImage(`./${req.file.path}`);
    var gender = req.params.gender;
    var posttype = req.params.type;
    Post.find({
        gender:gender,
        type:posttype
        
    }).then((data) => {
        if(!data){
            return res.status(404).send("No data")
        }
        var imageAndNames = data.map(d => ({
            img:d.main_image,
            name:d.name
        }));
        face_reco.train_data(imageAndNames);
        var list = face_reco.prdeict_results(serach_image);
        if(list.length == 0){
            return res.status(404).send("No matches")
        }
        var names = list.map(p => p.className);
        console.log(names);
        Post.find({name:{$in:names}}).then((result) => {
            res.status(200).send(result);
        }).catch((e)=>{res.status(400).send(e)})
    }).catch((e) => {res.status(400).send(e)})
})

app.post('/deletePost/:id',authinticate,(req,res) => {
   var id = req.params.id;
   if(!ObjectId.isValid(id)){
       return res.status(404).send()
   }
   Post.findOneAndDelete({
       _id:id,
       _creator:req.user._id
   }).then((result) => {
     if(!result){
         return res.status(404).send()
     }
     res.status(200).send(result);
   })
})

//Admin privleges and services
app.get('/users',authorize,(req,res) => {
    User.find({role:'user'}).then((users) => {
        if(!users){
            res.status(404).send();
        }else
         res.status(200).send(users)
    }).catch((e) => {res.status(400).send(e)})
})

app.get('/allPosts',authorize,(req,res) => {
  Post.find().then((posts) => {
      if(!posts){
          return res.status(404).send()
      }
       res.status(200).send(posts)
  }).catch((e) => {res.status(400).send(e)})
})

app.delete('/deleteUser/:id',authorize,(req,res) => {
  var id = req.params.id;
   if(!ObjectId.isValid(id)){
       res.status(400).send('invalid id')
   }

  User.findByIdAndDelete({_id:id}).then((user)=>{
     if(!user){
         res.status(404).send();
     }
      res.status(200).send();
  }).catch((e) =>{res.status(400).send(e)})
})

app.delete('/deletePost/:id',authorize,(req,res) => {
    Post.findOneAndDelete({_id:req.params.id}).then((result) => {
        if(!result)
         return res.status(404).send();
         res.status(200).send(result);
    }).catch((e) => {res.status(400).send(e)})
})

//Listen and Serve
app.listen(process.env.PORT,address,(error) => {
    if(error){
        console.log(error);
        }
        fullAddress = `http://${address}:${process.env.PORT}`;
        console.log(fullAddress);
    
     
})