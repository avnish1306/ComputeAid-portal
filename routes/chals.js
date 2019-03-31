const express = require('express');
const router = express.Router();

const Chal = require('../models/chal');
const Que=require('../models/que');
const Answer = require('../models/answer');
const Auth = require('../middlewares/auth');

router.post('/add', Auth.authenticateAdmin, (req, res, next) => {
    console.log(" add in ");
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('desc', 'Description is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('points', 'Points is required').notEmpty();
    req.checkBody('flag', 'Flag is required').notEmpty();

    const errors = req.validationErrors();

    if(!errors){
        const chal = new Chal({
            title: req.body.title,
            desc: req.body.desc,
            author: req.body.author,
            points: req.body.points,
            flag: req.body.flag,
        });
        chal.save()
        .then(result => {
            res.status(201).json({
                status: 1,
                msg: "Challenge added successfully"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: 0,
                error: "Internal Server Error"
            });
        });
    }
    else{
        console.log(errors);
        res.status(500).json({
            status: 0,
            error: "All fields are required"
        });
    }
});

router.get('/', Auth.authenticateAll, (req, res, next) => {
    Chal.find({}, 'title desc points files author users').then(chals => {
        res.status(200).json({
            status: 0,
            chals: chals
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            status: 0,
            error: "Internal server error"
        });
    });
});

router.post('/:id', Auth.authenticateUser, (req, res, next) => {
    req.validate('flag', 'Flag is required').notEmpty();
    const errors = req.validationErrors();

    if(!errors){
        Chal.findById(req.params.id).exec()
        .then(chal => {
            if(chal.flag===req.body.flag){
                if(chal.users.indexOf(req.user.name)>-1){
                    const answer = new Answer({
                        chal: req.params.id,
                        user: req.user.id,
                        flag: req.body.flag,
                        status: "correct"
                    });
                    answer.save()
                    .then(result =>{
                        res.status(200).json({
                            status: 1,
                            solved: 1,
                            msg: "You have already solved the challenge :P"
                        });
                    })
                    .catch(err =>{
                        console.log(err);
                        res.status(500).json({
                            status: 0,
                            error: "Internal Server Error"
                        });
                    });
                }
                else{
                    Chal.findByIdAndUpdate(req.params.id, {$push: {users: req.user.name}}).exec()
                    .then(chal => {
                        const answer = new Answer({
                            chal: req.params.id,
                            user: req.user.id,
                            flag: req.body.flag,
                            status: "correct"
                        });
                        answer.save()
                        .then(result =>{
                            res.status(200).json({
                                status: 1,
                                solved: 1,
                                msg: "Congratulations!! You have solved the challenge :)"
                            });
                        })
                        .catch(err =>{
                            console.log(err);
                            res.status(500).json({
                                status: 0,
                                error: "Internal Server Error"
                            });
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            status: 0,
                            error: "Internal server error"
                        });
                    });
                }
            }
            else{
                const answer = new Answer({
                    chal: req.params.id,
                    user: req.user.id,
                    flag: req.body.flag,
                    status: "wrong"
                });
                answer.save()
                .then(result =>{
                    res.status(200).json({
                        status: 1,
                        solved: 0,
                        msg: "That's not the correct flag :("
                    });
                })
                .catch(err =>{
                    console.log(err);
                    res.status(500).json({
                        status: 0,
                        error: "Internal Server Error"
                    });
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
            error: "Flag is required"
        });
    }
});

router.get('/:id/flag', Auth.authenticateAdmin, (req, res, next) => {
    Chal.findById(req.params.id, 'flag').exec()
    .then(result => {
        res.status(200).json({
            status: 1,
            msg: result.flag
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            status: 0,
            error: "Internal Server Error"
        });
    });
});

router.delete('/:id', Auth.authenticateAdmin, (req, res, next) => {
    Chal.remove({_id: req.params.id}).exec()
    .then(result => {
        res.status(200).json({
            status: 1,
            msg: "Chal deleted"
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            status: 0,
            error: "Internal Server Error"
        });
    });
});

module.exports = router;