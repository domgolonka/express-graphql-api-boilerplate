// eslint-disable-next-line func-names
module.exports = function (sequelize, DataTypes) {
  const Post = sequelize.define('posts', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    title: { type: DataTypes.STRING },
    text: { type: DataTypes.STRING }
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
    classMethods: {
      associate: function (models) {
        Post.belongsTo(models.authors, { as: 'author' });
      }
    }
  });
  return Post;
};
