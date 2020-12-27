var express = require('express');
var usersCtrl = require('../controllers/usersCtrl');

exports.router = (function () {
    //varibale apiRouter de type Router
    var apiRouter = express.Router();
    
    //apiRouter.route('/addResume').post(usersCtrl.addNewResume);
    //apiRouter.route('/updateResume').put(usersCtrl.updateResume);

    //Gestion User 
    apiRouter.route('/login').post(usersCtrl.login);
    apiRouter.route('/userUpdate').put(usersCtrl.userUpdate);
    apiRouter.route('/basicregister').post(usersCtrl.basicregister);
    apiRouter.route('/resetpwd').post(usersCtrl.resetPassword);


    //Gestion Job
    apiRouter.route('/addJob').post(usersCtrl.addNewJob);
    apiRouter.route('/updateJobVisibility').put(usersCtrl.updateJobVisibility);
    apiRouter.route('/updateJob').put(usersCtrl.updateJob);
    apiRouter.route('/getApplicants').get(usersCtrl.getEmployees);
    apiRouter.route('/getJobs').get(usersCtrl.getJobs);
    

    //non vérifié !
    apiRouter.route('/getMyJobList').get(usersCtrl.getMyJobList);
    apiRouter.route('/removeJob').delete(usersCtrl.removeJob);
    //apiRouter.route('/addEmp').post(usersCtrl.addNewEmployee);
    apiRouter.route('/getEmps').get(usersCtrl.getEmployees);
    //apiRouter.route('/Userlogin').post(usersCtrl.Userlogin);

    //Gestion services
    apiRouter.route('/sendEmail').post(usersCtrl.senEmail);


    return apiRouter;

})();