'use strict';
module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('Job', {
    job_name: DataTypes.STRING,
    job_description: DataTypes.STRING,
    job_addr: DataTypes.STRING,
    entrepreneur_id: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  }, {});
  Job.associate = function(models) {
    // associations can be defined here
  };
  return Job;
};