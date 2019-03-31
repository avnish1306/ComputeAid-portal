const jwt = require('jsonwebtoken');

module.exports = {
    authenticateUser: function(req, res, next){
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET);
            if(decoded.access === 3){
                console.log("user ",req.user);
                req.user = decoded;
                next();
            }
            else
                return res.status(401).json({
                    status: 0,
                    error: "Not Authorized"
                });
        } catch (err) {
            return res.status(401).json({
                status: 0,
                error: "Not Authorized"
            });
        }
    },

    authenticateMod: function(req, res, next){
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET);
            if(decoded.access === 2)
                next();
            else
                return res.status(401).json({
                    status: 0,
                    error: "Not Authorized"
                });
        } catch (err) {
            return res.status(401).json({
                status: 0,
                error: "Not Authorized"
            });
        }
    },

    authenticateAdmin: function(req, res, next){
        console.log(" admin in ");
        try {
            console.log(req.headers);
            const token = req.headers.authorization.split(' ')[1];
            console.log("token                 ",token);
            const decoded = jwt.verify(token, process.env.SECRET);
            console.log(" decoded              ",decoded);
            if(decoded.access === 1){
                //console.log(" access in ",req.user);
                req.user = decoded;
                //console.log(" req.user",req.user);
                next();
            }
            else
                return res.status(401).json({
                    status: 0,
                    error: "Not Authorized"
                });
        } catch (err) {
            return res.status(401).json({
                status: 0,
                error: "Not Authorized"
            });
        }
    },

    authenticateAll: function(req, res, next){
        try {
            console.log(" all in ");
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET);
            if(decoded){
                //console.log("user ",req.user);
                req.user = decoded;
                //console.log(" req.user",req.user);
                next();
            }
            else
                return res.status(401).json({
                    status: 0,
                    error: "Not Authorized"
                });
        } catch (err) {
            return res.status(401).json({
                status: 0,
                error: "Not Authorized"
            });
        }
    }
}