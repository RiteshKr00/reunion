const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const JWT = process.env.JWT_SEC;
const { authJwt } = require("../middlewares"); //no need to go one folder doen due to index file

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/ping", async (req, res) => {
    try {
      res.json({ message: "Connected" });
    } catch (err) {
      res.status(500).send({ err: err });
    }
  });
  // app.post("/signup", async (req, res) => {
  //   try {
  //     const { username, email, password } = req.body;
  //     if (!email || !password || !username) {
  //       return res.status(400).send({ error: "please add all the fields" });
  //     }
  //     let user = await User.create({
  //       username: req.body.username,
  //       email: req.body.email,
  //       password: bcrypt.hashSync(req.body.password, 8),
  //     });

  //     res.status(200).send({ message: "User was registered successfully!" });
  //   } catch (err) {
  //     res.status(500).send({ err: err });
  //   }
  // });
  //Authenticate
  app.post("/api/authenticate", async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email);
      if (!password || !email) {
        return res.status(400).send({ error: "please add all the fields" });
      }
      condition = { email };
      const user = await User.findOne({ where: condition });
      if (!user) {
        return res.status(404).send({ message: "User Not Found" });
      }
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      console.log(user);

      var token = jwt.sign({ id: user.id }, JWT, {
        expiresIn: 86400, // 24 hours
      });
      console.log(token);
      res.status(200).send({
        // id: user._id,
        // username: user.username,
        // email: user.email,
        accessToken: token,
      });
    } catch (err) {
      res.status(500).send({ err: err });
    }
  });

  //follow
  app.post("/api/follow/:id", [authJwt.verifyToken], async (req, res) => {
    try {
      const userId = req.params.id;
      console.log(userId);
      //user1(to be followed)<-----user2(logged in User)
      const user = await User.findOne({
        where: { id: userId },
        attributes: { exclude: ["password"] }, //remove password from result
      });
      const user2 = await User.findOne({
        where: { id: req.userId },
        attributes: { exclude: ["password"] }, //remove password from result
      });
      console.log(user2);
      if (user) {
        console.log("here");
        if (user.follower.includes(req.userId)) {
          return res.status(200).send("Already followed");
        } else {
          await User.update(
            {
              follower: user.follower.concat([req.userId]),
              followerCount: user.followerCount + 1,
            },
            {
              where: { id: userId },
            }
          );
          //update following field also
          await User.update(
            {
              following: user2.following.concat([userId]),
              followingCount: user2.followingCount + 1,
            },
            {
              where: { id: req.userId },
            }
          );
        }
      }
      res.status(200).send("Followed successfully");
    } catch (err) {
      res.status(500).send({ err: err });
    }
  });
  //unfollow
  app.post("/api/unfollow/:id", [authJwt.verifyToken], async (req, res) => {
    try {
      const userId = req.params.id;
      console.log(userId);
      //user1(to be followed)<-----user2(logged in User)
      const user = await User.findOne({
        where: { id: userId },
        attributes: { exclude: ["password"] }, //remove password from result
      });
      const user2 = await User.findOne({
        where: { id: req.userId },
        attributes: { exclude: ["password"] }, //remove password from result
      });
      console.log(user2);
      if (user) {
        console.log("here");
        if (user.follower.includes(req.userId)) {
          await User.update(
            {
              follower: user.follower.filter((Id) => Id != req.userId),
              followerCount: user.followerCount - 1,
            },
            {
              where: { id: userId },
            }
          );
          //update following field also
          await User.update(
            {
              following: user2.following.filter((Id) => Id != userId),
              followingCount: user2.followingCount - 1,
            },
            {
              where: { id: req.userId },
            }
          );
        } else {
          return res.status(200).send("Follow first to Unfollow ");
        }
      }
      res.status(200).send("UnFollowed successfully");
    } catch (err) {
      res.status(500).send({ err: err });
    }
  });
  //get my user profile
  app.get("/api/user", [authJwt.verifyToken], async (req, res) => {
    try {
      console.log("first");
      const user = await User.findOne({
        where: { id: req.userId },
        attributes: ["username", "followerCount", "followingCount"],
      });
      res.status(200).send(user);
    } catch (err) {
      res.status(500).send({ err: err });
    }
  });
};

//follow or Unfollow can be broken into two
// app.post("/follow/:id", [authJwt.verifyToken], async (req, res) => {
//   try {
//     const userId = req.params.id;
//     console.log(userId);
//     //user1(to be followed)<-----user2(logged in User)
//     const user = await User.findOne({
//       where: { id: userId },
//       attributes: { exclude: ["password"] }, //remove password from result
//     });
//     const user2 = await User.findOne({
//       where: { id: req.userId },
//       attributes: { exclude: ["password"] }, //remove password from result
//     });
//     console.log(user2);
//     if (user) {
//       console.log("here");
//       if (user.follower.includes(req.userId)) {
//         await User.update(
//           {
//             follower: user.follower.filter((Id) => Id != req.userId),
//             followerCount: user.followerCount - 1,
//           },
//           {
//             where: { id: userId },
//           }
//         );
//         //update following field also
//         await User.update(
//           {
//             following: user2.following.filter((Id) => Id != userId),
//             followingCount: user.followingCount - 1,
//           },
//           {
//             where: { id: req.userId },
//           }
//         );
//       } else {
//         await User.update(
//           {
//             follower: user.follower.concat([req.userId]),
//             followerCount: user.followerCount + 1,
//           },
//           {
//             where: { id: userId },
//           }
//         );
//         //update following field also
//         await User.update(
//           {
//             following: user2.following.concat([userId]),
//             followingCount: user.followingCount + 1,
//           },
//           {
//             where: { id: req.userId },
//           }
//         );
//       }
//     }
//     res.status(200).send(user2);
//   } catch (err) {
//     res.status(500).send({ err: err });
//   }
// });
