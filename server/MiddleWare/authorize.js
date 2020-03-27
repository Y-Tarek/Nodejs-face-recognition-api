const {authinticate} = require('./authintcate');
//Authorizing admin MiddleWare
authorize = (req,res,authinticate,next) => {
   if(req.user.role == 'admin'){
       next();
   }else{
       return Promise.reject();
   }
} 

 module.exports = {authorize}