const Sequelize = require('sequelize');
const UserModel = require('./models/user')
const JobModel = require('./models/job')

const sequelize = new Sequelize('job_platform', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})
const User = UserModel(sequelize, Sequelize);
const Job = JobModel(sequelize, Sequelize);


sequelize.sync({ force: false })
  .then(() => {
    console.log(`Database & tables created!`)
  })
  module.exports = {
    User,
    Job
  }
  
