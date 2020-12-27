const { User } = require("../squelize");
const { Job } = require("../squelize");
const mailService = require('../services/mail.service');
const key = require("../utils/key");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generatePassword = require('password-generator');
const job = require("../models/job");



module.exports = {
login: async function (req, res) {
        const email = req.body.email;
        const password = req.body.password;

        await User.findOne({
            where: {
                email: email,
            }
        }).then((user) => {
            if (user == null) {
                res.status(401).json({
                    error: 401,
                    message: "Authentification echoué"
                })
            } else {
                bcrypt.compare(password, user.password, function (errBcrypt, resBcrypt) {
                    if(resBcrypt){
                        var token = jwt.sign({ userId: user.id }, key.tokenKey);
                        res.status(200).json({ user, token });
                    }else{
                        res.status(403).json({
                            error: 403,
                            message: "Wrong password"
                        })
                    }
                });
            }
    
        });
},

resetPassword:async function (req,res,next){
    const email = req.body.email;
    User.findOne({
        where: { email: email }
    }).then((user) => {
        if(user==null){
            res.status(403).json({
                error: 403,
                message: "Wrong email"
            })
        }else{
            const new_password = generatePassword(12, false);
            bcrypt.hash(new_password, 5, function (err, bcryptedPassword) {
                User.update({
                    password:bcryptedPassword
                } ,
                    {
                        returning: true,
                        where: { id: user.id }
                    });
            });
            mailService().send({
                to: user.email,
                subject: 'Password Reset',
                content: `This is your new JOB PLATFORM password : ${new_password}`
              }).then(() =>{
                return res.json({
                    success: true
                })
                  }).catch(function (err) {
                return res.status(500).json({
                    'error': err
                });
            });
        }
    });
},
/*Userlogin: async function (req, res) {
        const email = req.body.email;
        User.findOne({
            where: {
                email: email,
                isAdmin: false
            }
        }).then((user) => {
            if (user == null) {
                res.status(401).json({
                    error: 401,
                    message: "Authentification echoué"
    
                })
            } else {
                res.status(200).json({
                    userId: user.id
                })
            }
    
        });
},*/

basicregister: async function (req, res) {
    const email = req.body.email;
    let newacc = req.body;

    await User.findOne({
        where: {
            email: email
        }
    }).then(async(user) => {
        if (user) {
                res.status(409).json({
                error: 409,
                message: "The email is already exist! "
            })
        } if(!user) {
            await bcrypt.hash(newacc.password, 5, function (err, hash) {
                User.create({
                    password: hash,
                    email: newacc.email,
                    isEntrep:newacc.isEntrep
                }).then(usr => {
                    var token = jwt.sign({ userId: usr.id }, key.tokenKey);
                    res.status(201).json({ usr, token });
                })
            });
        }
    });
},


userUpdate : async function (req, res) {
    //const userId = req.params.id;
    const user_id=req.body.id;
    let user = req.body;

    await User.update(
        user
        ,
        {
            returning: true,
            where: {"id": req.body.id }
        }
    ).then(result => {
        res.status(201).json(result);
    })
},

/*addNewResume: async function (req, res) {
        const email = req.body.email;
        let utilisateur = req.body;
    
        await User.findOne({
            where: {
                email: email,
                isEntrep: false
            }
        }).then(async(user) => {
            if (user) {
                    res.status(409).json({
                    error: 409,
                    message: "You have already a resume with this e-mail"
                })
            } if(!user) {
                await User.create({
                        full_name: req.body.full_name,
                        phone: req.body.phone,
                        profile_desc: req.body.profile_desc,
                        email: req.body.email,
                        //still the upload of pic and cv_file 
                        isAdmin:false
                    }).then(usr => {
                        res.status(201).json({ usr });
                });
            }
        });
    },*/

/*updateResume: async function (req, res) {
        await User.update(
            {   full_name: utilisateur.full_name,
                phone: utilisateur.phone,
                profile_desc: utilisateur.profile_desc,
                email: utilisateur.email,
                //still the upload of pic and cv_file 
                isAdmin:false},
            {where: {"id": req.body.id }})
            .then(()=>res.status(200).json({"result":"updated"}));
    },*/


addNewJob: async function (req, res) {
        const job_name = req.body.job_name;
        let newjob = req.body;
    
        await Job.findOne({
            where: {
                job_name: job_name
            }
        }).then(async(job) => {
            if (job) {
                    res.status(409).json({
                    error: 409,
                    message: "You have already added this job ! "
                })
            } if(!job) {
                await Job.create(newjob/*{
                        job_name: newjob.job_name,
                        job_description: newjob.job_description,
                        job_addr:newjob.job_addr,
                        entrepreneur_id: newjob.entrepreneur_id,
                        isActive:true
                    }*/).then(jobb => {
                        res.status(201).json({ jobb });
                });
            }
        });
    },
updateJobVisibility: async function (req, res) {
            await Job.update(
                {isActive:req.body.isActive},
                {where: {"id": req.body.id }})
                .then(()=>res.status(200).json({"result":"updated"}));
        },

updateJob: async function (req, res) {
    let jobb=req.body;
    const job_name = req.body.job_name;
    await Job.findOne({
        where: {
            job_name: job_name
        }
    }).then(async(job) => {
        if (job) {
                res.status(409).json({
                error: 409,
                message: "You have already added this job ! "
            })
        } if(!job) {
            await Job.update(
                jobb,
                {where: {"id": req.body.id }})
                .then(()=>res.status(200).json({"result":"updated"}));
            }
        });
        },

getEmployees: async function (req, res){
            await User.findAll().then(users => {
                return res.status(200).json({
                    users
                })
              })   
        },
        
getJobs: async function (req, res){
        await Job.findAll({where:{isActive:true}}).then(jobs => {
            return res.status(200).json({
                jobs
            })
          })   
    },

getMyJobList: async function (req, res){
    var query = require('url').parse(req.url,true).query;
    const userId = query.user_id;
    await Job.findAll({where:{user_id:userId}}).then(jobs => {
        return res.status(200).json({
            jobs
        })
      })   
},

removeJob: async function (req, res){
    var query = require('url').parse(req.url,true).query;
    const jobId = query.job_id;
    Job.destroy(
        {
            where: {
                "id": jobId
            }
        }
    ).then(job => {
        res.status(201).json(job);
    })
},
/*addNewEmployee: async function (req, res) {
    const email = req.body.email;
    let newEmp = req.body;

    await User.findOne({
        where: {
            email: email
        }
    }).then(async(emp) => {
        if (emp) {
                res.status(409).json({
                error: 409,
                message: "You have already added this job ! "
            })
        } if(!emp) {
            await User.create({
                    full_name: newEmp.full_name,
                    phone: newEmp.phone,
                    profile_desc: newEmp.profile_desc,
                    email: newEmp.email,
                    //still the upload of pic and cv_file 
                    isAdmin:false
                }).then(empp => {
                    res.status(201).json({ empp });
            });
        }
    });
},*/
getEmployees: async function (req, res){
    await User.findAll({where:{isEntrep:false}}).then(emps => {
        return res.status(200).json({
            emps
        })
      })   
},

senEmail:async function(req,res,next){
    const email = req.body.email;
    const subj = req.body.subject;
    User.findOne({
        where: { email: email }
    }).then((user) => {
        if(user==null){
            res.status(403).json({
                error: 403,
                message: "Wrong email"
            })
        }else{
            const body= req.body.body;
            mailService().send({
                to: user.email,
                subject: subj,
                content: ` content : ${body}`
              }).then(() =>{
                return res.json({
                    success: true
                })
                  }).catch(function (err) {
                return res.status(500).json({
                    'error': err
                });
            });
        }
    });
}
}