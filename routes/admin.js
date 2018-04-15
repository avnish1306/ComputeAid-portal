const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', (req, res, next) => {
    req.checkBody('email', 'Email not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();

    const errors = req.validationErrors();

    if(!errors){
        User.findOne({email: req.body.email}).exec()
        .then(user => {
            if(user){
                bcrypt.compare(req.body.password, user.password, function(err, result) {
                    if(err){
                        return res.status(401).json({
                            status: 0,
                            error: "Invalid email & password"
                        });
                    }
                    if(result){
                        jwt.sign({
                            email: user.email,
                            id: user._id,
                            name: user.name,
                            access: user.access
                        }, process.env.SECRET, {
                            expiresIn: "6h",
                        }, function(err, token){
                            if(err){
                                console.log(err);
                                return res.status(500).json({
                                    status: 0,
                                    error: "Problem signing in"
                                });
                            }
                            else{
                                return res.status(200).json({
                                    status: 1,
                                    msg: "Logged in successfully",
                                    token: token
                                });
                            }
                        });
                    }
                });
            }
            else{
                return res.status(401).json({
                    status: 0,
                    error: "Invalid email & password"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: 0,
                error: "Internal server error"
            });
        });
    }
    else{
        res.status(500).json({
            status: 0,
            error: "All fields should be filled correctly"
        });
    }
});

module.exports = router;