const User = require('../models/user');

exports.getUserById =(req, res, next, id) =>{
    User.findById(id).exec((err, user) =>{
        if(err || !user){
            return res.status(404).json({
                "error":"user not found in DataBase"
            })
        }
        req.profile = user;
        next();
    })
};


exports.returnUser = (req, res) =>{
    res.send(req.profile);
}

exports.getUser = (req, res) =>{
    req.profile.salt = undefined;
    req.profile.encry_password= undefined;
    return res.json(req.profile);
}


exports.updateUser =  (req, res) =>{
    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$set: req.body},
        {new:true},
        ).exec((err, user) =>{
            if(err){
                res.json({
                   "error":"user cannot be updated"
                })
            }
            res.json(user)
    });
}

exports.getUsers = (req, res) =>{
   User.find().exec((err, users) =>{
       if(err || !users){
          return res.json({
               "error":"error getting users"
           })
       }
       res.json(users)
   })
}
