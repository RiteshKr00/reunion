module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("comment", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    comment: {
      type: DataTypes.STRING,
    },
    commentedBy: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
  });

  return Comment;
};
