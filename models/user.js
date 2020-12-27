'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    profile_desc: DataTypes.STRING,
    cv_file: DataTypes.STRING,
    picture: DataTypes.STRING,
    isEntrep: DataTypes.BOOLEAN,
    company_name:DataTypes.STRING,
    company_addr:DataTypes.STRING,
    company_phone:DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};