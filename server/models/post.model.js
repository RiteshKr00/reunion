module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("posts", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    like: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  return Post;
};
