// eslint-disable-next-line func-names
module.exports = function (sequelize, DataTypes) {
  const Author = sequelize.define('authors', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
      type: DataTypes.STRING,
      // Will result in an attribute that is firstName when user facing but first_name in the DB
      field: 'first_name',
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name',
      allowNull: false,
    },
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
    classMethods: {
      associate(models) {
        Author.hasMany(models.posts, { as: 'posts' });
      },
    },
  });
  return Author;
};
