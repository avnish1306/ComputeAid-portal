const express = require('express');
const router = express.Router();

const Chal = require('../models/chal');
const Que=require('../models/que');
const Answer = require('../models/answer');
const Auth = require('../middlewares/auth');
const User=require('../models/user');
//Auth.authenticateAll, 
router.post('/add',Auth.authenticateAll,  (req, res, next) => {
    req.checkBody('lang', 'Language is required').notEmpty();
    req.checkBody('desc', 'Description is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('points', 'Points is required').notEmpty();
    req.checkBody('sol', 'Solution is required').notEmpty();
    req.checkBody('opt', 'Option is required').notEmpty();
    req.checkBody('type','Question Type is required').notEmpty();

    const errors = req.validationErrors();

    if(!errors){
        const que = new Que({
            lang: req.body.lang,
            desc: req.body.desc,
            author: req.body.author,
            points: req.body.points,
            sol: req.body.sol,
            opt: req.body.opt,
            type: req.body.type
        });
        que.save()
        .then(result => {
            res.status(201).json({
                status: 1,
                msg: "Question added successfully"
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

router.post('/saveAns',Auth.authenticateAll,(req,res,next)=>{
    User.findOne({'name':req.user.name},(err,user)=>{
        if(err){
            res.status(500).json({
                status: 0,
                saved:0,
                msg:"Fail to Save",
                error: "Internal server error"
            });
        }
        console.log(user);
        var newSubmission= user.submission.filter(sub=>{
            return sub.queId!=req.body.queId;
        })
        newSubmission.push(req.body);
        user.submission=newSubmission;
        user.save().then(newUser=>{
            res.status(201).json({
                status: 1,
                saved:1,
                msg:"Saved",
                error: "Internal server error"
            });
        }).catch(err=>{
            res.status(500).json({
                status: 0,
                saved:0,
                msg:"Fail to Save",
                error: "Internal server error"
            });
        })
        

    })
})
//Auth.authenticateAll,
router.get('/', Auth.authenticateAll,  (req, res, next) => {
    Que.find({'lang':req.user.lang}, 'desc opt points author type').then(ques => {
        User.findOne({'name':req.user.name},(err,user)=>{
            if(err){
                res.status(500).json({
                    status: 0,
                    error: "Internal server error"
                });
            }
            res.status(200).json({
                status: 1,
                ques: ques,
                submission: user.submission
            });
        })
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            status: 0,
            error: "Internal server error"
        });
    });
});

router.delete('/:id', Auth.authenticateAdmin, (req, res, next) => {
    Que.remove({_id: req.params.id}).exec()
    .then(result => {
        res.status(200).json({
            status: 1,
            msg: "Que deleted"
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
router.get('/viewSol/:id',Auth.authenticateAdmin,(req,res,next)=>{
    Que.findById(req.params.id, 'sol').exec()
    .then(result => {
        res.status(200).json({
            status: 1,
            sol:result.sol
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            status: 0,
            error: "Internal Server Error"
        });
    });
})
router.get("/submitSol",Auth.authenticateAll,(req,res,next)=>{
    User.findOne({'name':req.user.name},(err,user)=>{
        if(err){
            res.status(500).json({
                status:0,
                error:err,
                msg:"Not Submitted"
            })
        }
        if(!user.contests.bughunt.status){
            Que.find({'lang':req.user.lang},(err,ques)=>{
                if(err){
                    res.status(500).json({
                        status:0,
                        error:err,
                        msg:"Not Submitted"
                    })
                }
                const userSub=user.submission;
                var score=0;
                //console.log(userSub,"     xxxxxxxxxxxxx   ",ques);
                for(var i=0;i<userSub.length;i++){
                    if(userSub[i].ans.length>0){
                        var que=findQuestionById(userSub[i].queId,ques);
                        console.log("que ",que)
                        if(que==null)
                            continue;
                        if(que.type==1){
                            if(userSub[i].ans[0]==que.sol[0]){
                                score=score+que.points;
                            }else{
                                score=score-(que.points*0.25);
                            }
                        }else{
                            var correctAns=0,wrongAns=0;
                            for(var j=0;j<userSub[i].ans.length;j++){
                                if(findAns(userSub[i].ans[j],que.sol)){
                                    correctAns+=1;
                                }else{
                                    wrongAns+=1;
                                }
                            }
                            if(wrongAns==0){
                                score=score+((que.points)/(que.sol.length))*correctAns;
                            }
                        }
                    }
                }
                user.contests.bughunt.score=score;
                user.contests.bughunt.status=true;
                user.contests.bughunt.timeLeft=null;
                user.save().then(newUser=>{
                    res.status(201).json({
                        status:1,
                        msg:"Submitted"
                    })
                }).catch(err=>{
                    res.status(201).json({
                        status:0,
                        msg:"Not Submitted",
                        error:err
                    })
                });
                
            })
        }else{
            res.status(201).json({
                status:0,
                msg:"Not Submitted",
                error:err
            })
        }
    })
});
function findAns(ans,sol){
    for(var i=0;i<sol.length;i++){
        if(ans==sol[i])
            return true;
    }
    return false;
}
function findQuestionById(id,ques){
    for(var i=0;i<ques.length;i++){
        if(ques[i].id==id){
            return ques[i];
        }
    }
    return null;
}



module.exports = router;