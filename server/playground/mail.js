const sendmail = require('sendmail')();
var sendEmail = (to,subj)=>{
    sendmail({
        from: process.env.DOMAIN_MAIL,
        to: to,
        subject: subj,
      }, function(err, reply) {
        console.log(err && err.stack);
        console.dir(reply);
    });
}