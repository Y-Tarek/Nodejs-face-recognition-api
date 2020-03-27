const {User} = require('./../db/models/user');
// Authintication MiddleWare
authinticate = (req,res,next) => {
   var token = req.header("Authorization").split(' ')[1];
   User.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject();
        }
      req.token = token;
      req.user = user;
      next();
   }).catch((e) => {res.status(401).send(e)})
}

module.exports = {authinticate};