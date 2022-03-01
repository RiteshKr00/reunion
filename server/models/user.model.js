module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      isEmail: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    follower: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    followerCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    following: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    followingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  return User;
};
