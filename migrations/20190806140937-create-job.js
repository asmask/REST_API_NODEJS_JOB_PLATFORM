'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Jobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      job_name: {
        type: Sequelize.STRING
      },
      job_description: {
        type: Sequelize.STRING
      },
      job_addr: {
        type: Sequelize.STRING
      },
      entreprenur_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
            model: 'Users',
            key:'id'
        }

      },
      isActive: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Jobs');
  }
};