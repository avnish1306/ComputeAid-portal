const express = require('express');
const router = express.Router();

const Chal = require('../models/chal');
const Que=require('../models/que');
const Flaw=require('../models/flaw');
const Sub = require('../models/sub');
const Auth = require('../middlewares/auth');
const User=require('../models/user');
const { c,cpp,node,python,java} = require('compile-run');

const negScore=0;
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
        /*let buff=new Buffer(req.body.ipFile.value,'base64');
        let ipFile=buff.toString('ascii');
        let buff2=new Buffer(req.body.opFile.value);
        let opFile=buff2.toString('ascii');*/
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

router.post('/execute',Auth.authenticateAll, function(req, res,next) {
    /*fs.writeFile("C:\\Users\\user\\Desktop\\submitfile."+req.body.lang,req.body.c, function(err) {
        if(err) {
            return console.log(err);
        }
    }); 
    // fs.readFile("C:\\Users\\user\\Desktop\\input.txt",'utf8',function(err, contents) {
    //     input = contents;
    //     console.log(input);
    // });
    var input = fs.readFileSync("C:\\Users\\user\\Desktop\\input.txt",'utf8').toString();
    var output = fs.readFileSync("C:\\Users\\user\\Desktop\\output.txt",'utf8').toString();*/
    Flaw.findOne({'qCode':req.body.qCode},(err,flaw)=>{
        if(err){
            res.status(500).json({
                status: 0,
                ms:"Question Not Found"
            });
        }
        let ibuff=new Buffer(flaw.ipFile.value,'base64');
        var input=ibuff.toString('ascii');

        let obuff=new Buffer(flaw.opFile.value,'base64');
        var output=obuff.toString('ascii');

        let resultPromise;
        if(req.body.lang == 'c')
            resultPromise = c.runSource(req.body.code, { stdin: input, timeout: flaw.timeLimit});
        if(req.body.lang == 'cpp')
            resultPromise = cpp.runSource(req.body.code, { stdin: input, timeout: flaw.timeLimit});
        if(req.body.lang == 'java')
            resultPromise = java.runSource(req.body.code, { stdin: input, timeout: flaw.timeLimit});
        if(req.body.lang == 'py')
            resultPromise = python.runSource(req.body.code, { stdin: input, timeout: flaw.timeLimit});
        resultPromise
            .then(result => {
                if(result.errorType == "run-time") {
                    if(result.exitCode == null)
                        saveSubmission(req,res,result,4,"TLE",negScore,"JUDGED")
                    //res.status(200).send({ status:1,res: result, eCode: 4}); //tle
                    if(result.exitCode > 0)
                        saveSubmission(req,res,result,3,"RTE",negScore,"JUDGED")//res.status(200).send({ status:1,res: result, eCode: 3});  //rte
                }
                else
                if(result.errorType == "pre-compile-time") {
                    saveSubmission(req,res,result,21,"PCTE",negScore,"JUDGED")//res.status(200).send({res: result, code: 21});   //cte
                }
                else
                if(result.errorType == "compile-time") {
                    saveSubmission(req,res,result,2,"CTE",negScore,"JUDGED")//res.status(200).send({res: result, code: 2});   //cte
                }
                else
                if(output == result.stdout)
                     saveSubmission(req,res,result,1,"AC",flaw.points,"JUDGED")//res.status(200).send({res: result, code: 1});  //ac
                else
                    saveSubmission(req,res,result,0,"WA",negScore,"JUDGED")//res.status(200).send({res: result, code: 0});  //wa
            })
            .catch(err => {
                saveSubmission(req,res,null,100,"",negScore,"UNJUDGED")//res.status(500).send(err);
            });
    })
    
});

function saveSubmission(req,res,result,eCode,eType,score,status){
    var d=new Date();
    const sub=new Sub({
        qCode:req.body.qCode,
        code:req.body.code,
        name:req.user.name,
        lang:req.body.lang,
        submittedOn:d,
        result: eType,
        points:score,
        status:status,
        desc: result.stderr

    });
    sub.save().then(newSub=>{
        User.findOne({'name':req.user.name},(err,user)=>{
            if(err){
                res.status(500).json({
                    status:0,
                    msg:"Failed to find in user",
                    error:err
        
                })
            }
            var newFlawSubmission= user.flawSubmission.filter(sub=>{
                return sub.qCode!=req.body.qCode;
            })
            var newSub={
                'qCode':req.body.qCode,
                'code':req.body.code,
                'result':eType,
                'status':status
            }
            if(result&&eCode==1){
                user.contests.flawless.score=user.contests.flawless.score+score;
            }else if(result){
                user.contests.flawless.score=user.contests.flawless.score-score;
            }
            newFlawSubmission.push(newSub);
            user.flawSubmission=newFlawSubmission;
            user.save().then(newUser=>{
                        res.status(200).json({
                            status:1,
                            msg:status,
                            res:result,
                            eCode:eCode
                
                        })
                    
                   
                
            }).catch(err=>{
                res.status(500).json({
                    status:0,
                    msg:"Fail to save user",
                    error:err
        
                })
            })
            
        })
        
        
    }).catch(err=>{
        res.status(500).json({
            status:1,
            msg:"Submission not save",
            error:err

        })
    })
}

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