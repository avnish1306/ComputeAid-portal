const express = require('express');
const router = express.Router();

const Chal = require('../models/chal');
const Que=require('../models/que');
const Flaw=require('../models/flaw');
const Answer = require('../models/answer');
const Auth = require('../middlewares/auth');
const User=require('../models/user');
//Auth.authenticateAll, 
router.post('/add',Auth.authenticateAll,  (req, res, next) => {
    req.checkBody('qCode', 'Question Code is required').notEmpty();
    req.checkBody('desc', 'Description is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('points', 'Points is required').notEmpty();
    req.checkBody('qName', 'Question Name is required').notEmpty();
    req.checkBody('ipFormat', 'Input format is required').notEmpty();
    req.checkBody('opFormat','Output Format is required').notEmpty();
    req.checkBody('ipFile','Input File is required').notEmpty();
    req.checkBody('opFile','Output File is required').notEmpty();
    req.checkBody('constraint','Constraint is required').notEmpty();
    req.checkBody('testcase','TestCase is required').notEmpty();
    req.checkBody('explain','Explain is required').notEmpty();
    req.checkBody('timeLimit','Time Limit is required').notEmpty();
    req.checkBody('sourceLimit','Source Limit is required').notEmpty();

    const errors = req.validationErrors();

    if(!errors){
        const flaw = new Flaw({
            qCode: req.body.qCode,
            desc: req.body.desc,
            author : req.body.author,
            points: req.body.points,
            qName: req.body.qName,
            ipFormat: req.body.ipFormat,
            opFormat: req.body.opFormat,
            ipFile: req.body.ipFile,
            opFile: req.body.opFile,
            constraint: req.body.constraint,
            testcase: req.body.testcase,
            explain: req.body.explain,
            timeLimit: req.body.timeLimit,
            sourceLimit : req.body.sourceLimit
        });
        flaw.save()
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

router.post('/execute', function(req, res) {
    fs.writeFile("C:\\Users\\user\\Desktop\\submitfile."+req.body.l,req.body.c, function(err) {
        if(err) {
            return console.log(err);
        }
    }); 
    // fs.readFile("C:\\Users\\user\\Desktop\\input.txt",'utf8',function(err, contents) {
    //     input = contents;
    //     console.log(input);
    // });
    var input = fs.readFileSync("C:\\Users\\user\\Desktop\\input.txt",'utf8').toString();
    var output = fs.readFileSync("C:\\Users\\user\\Desktop\\output.txt",'utf8').toString();
    let resultPromise;
    if(req.body.l == 'c')
        resultPromise = c.runFile('C:\\Users\\user\\Desktop\\submitfile.c', { stdin: input, timeout: 1000});
    if(req.body.l == 'cpp')
        resultPromise = cpp.runFile('C:\\Users\\user\\Desktop\\submitfile.cpp', { stdin: input, timeout: 1000});
    if(req.body.l == 'java')
        resultPromise = java.runFile('C:\\Users\\user\\Desktop\\submitfile.java', { stdin: input, timeout: 1000});
    if(req.body.l == 'py')
        resultPromise = python.runFile('C:\\Users\\user\\Desktop\\submitfile.py', { stdin: input, timeout: 1000});
    resultPromise
        .then(result => {
            if(result.errorType == "run-time") {
                if(result.exitCode == null)
                  res.status(200).send({res: result, code: 4});
                if(result.exitCode > 0)
                  res.status(200).send({res: result, code: 3});
            }
            else
            if(result.errorType == "compile-time") {
                res.status(200).send({res: result, code: 2});
            }
            else
            if(output == result.stdout)
              res.status(200).send({res: result, code: 1});
            else
              res.status(200).send({res: result, code: 0});
        })
        .catch(err => {
            res.status(200).send(err);
        });
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
    Flaw.find({}).then(flaws => {
        res.status(201).json({
            status: 1,
            flaws:flaws
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



module.exports = router;