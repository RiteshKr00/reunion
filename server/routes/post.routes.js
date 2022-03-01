const db = require("../models");
const User = db.user;
const Post = db.post;
const Comment = db.comment;
const { authJwt } = require("../middlewares"); //no need to go one folder doen due to index file

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
      //can be done by cors package
    );
    next();
  });
  //Add post
  app.post("/api/posts", [authJwt.verifyToken], async (req, res) => {
    try {
      const { title, description } = req.body;
      if (!title || !description) {
        return res.status(400).send({ error: "please add all the fields" });
      }
      console.log(title, description);
      console.log(req.userId);
      const post = await Post.create({
        title,
        description,
        userId: req.userId,
      });
      const result = {
        id: post.id,
        Title: post.title,
        Description: post.description,
        createdAt: post.createdAt,
      };
      res.status(200).send(result);
    } catch (err) {
      res.status(500).send({ err: err });
    }
  });
  //like a post
  app.post("/api/like/:id", [authJwt.verifyToken], async (req, res) => {
    try {
      const postId = req.params.id;
      console.log(postId);
      const post = await Post.findOne({
        where: { id: postId },
        attributes: ["like", "likeCount"],
      });
      if (post) {
        if (post.like.includes(req.userId)) {
          return res.status(404).send("Already liked");
        } else {
          await Post.update(
            {
              like: post.like.concat([req.userId]),
              likeCount: post.likeCount + 1,
            },
            {
              where: { id: postId },
            }
          );
        }
        return res.status(200).send("Post Liked");
      }
      res.status(404).send("Post Not Found");
    } catch (err) {
      res.status(500).send({ err: err });
    }
  });
  //Dislike
  app.post("/api/dislike/:id", [authJwt.verifyToken], async (req, res) => {
    try {
      const postId = req.params.id;
      console.log(postId);
      const post = await Post.findOne({
        where: { id: postId },
        attributes: ["like", "likeCount"],
      });
      if (post) {
        if (post.like.includes(req.userId)) {
          await Post.update(
            {
              like: post.like.filter((id) => id != req.userId),
              likeCount: post.likeCount - 1,
            },
            { where: { id: postId } }
          );
          return res.status(200).send("Post Disliked");
        } else {
          return res.status(404).send("Like First to unlike");
        }
      }
      res.status(404).send("Post Not Found");
    } catch (err) {
      res.status(500).send({ err: err });
    }
  });
  //delete post
  app.delete("/api/post/:id", [authJwt.verifyToken], async (req, res) => {
    try {
      const postId = req.params.id;
      console.log(postId);
      const deletedpost = await Post.destroy({
        where: {
          id: postId,
        },
      });
      res.json("Post Deleted Succesfully");
    } catch (err) {
      res.status(500).send({ err: err });
    }
  });
  app.get("/api/all_posts", [authJwt.verifyToken], async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findAll({
        include: [
          {
            model: Comment,
            // required: true
          },
        ],
      });
      console.log(post);

      if (post) return res.status(200).send(post);
      else return res.status(404).send("Post not found");
    } catch (err) {
      res.status(500).send({ err: err });
    }
  });
  app.get("/api/posts/:id", [authJwt.verifyToken], async (req, res) => {
    try {
      const postId = req.params.id;
      console.log(postId);
      const post = await Post.findOne({
        where: { id: postId },
        include: [
          {
            model: Comment,
            where: { postId: postId },
          },
        ],
      });
      if (post) res.status(200).send(post);
      else res.status(404).send("Post not found");
    } catch (err) {
      res.status(500).send({ err: err });
    }
  });
  //Add comment
  app.post("/api/comment/:id", [authJwt.verifyToken], async (req, res) => {
    try {
      const postId = req.params.id;
      console.log(postId);
      const { comment } = req.body;
      if (!comment) {
        return res.status(400).send({ error: "Please add comment" });
      }
      const com = await Comment.create({
        comment: comment,
        commentedBy: req.userId,
        postId: postId,
      });
      res.status(200).send({ commentID: com.id });
    } catch (err) {
      res.status(500).send({ err: err });
    }
  });
};
