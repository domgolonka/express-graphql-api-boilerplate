module.exports = {
  up: function (queryInterface, DataTypes) {

    return queryInterface.createTable('authors', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE
      },
      updatedAt: {
        type: DataTypes.DATE
      }
    })
      .then(() => {
        return queryInterface.createTable('posts', {
          id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
          },
          title: { type: DataTypes.STRING },
          text: { type: DataTypes.STRING },
          createdAt: {
            type: DataTypes.DATE
          },
          updatedAt: {
            type: DataTypes.DATE
          },
          authorId: {
            type: DataTypes.UUID,
            references: {
              model: 'authors',
              key: 'id'
            },
            onUpdate: 'cascade',
            onDelete: 'cascade'
          }
        });
      });
  },

  down: function (queryInterface) {
    return queryInterface.dropTable('authors')
      .then(() => {
        return queryInterface.dropTable('posts');
      });
  }
};
