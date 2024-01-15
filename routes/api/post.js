import express from "express";
import { check, validationResult } from "express-validator";
import authenticate from "../../middleware/auth.js";
import Post from "../../models/PostsModel.js";
import User from "../../models/UsersModel.js";
import checkObjectId from "../../middleware/checkObjectId.js";
import { createPost, getPost } from "../../controllers/postController.js";

const postRouter = express.Router();

// @route    POST api/posts
// @desc     Create a post
// @access   Private
postRouter.post("/", authenticate, createPost);

// @route    GET api/posts
// @desc     Get all posts
// @access   Private
postRouter.get("/", authenticate, getPost);

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
postRouter.get("/:id", authenticate, checkObjectId("id"), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);

    res.status(500).send("Server Error");
  }
});

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
postRouter.delete(
  "/:id",
  [authenticate, checkObjectId("id")],
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }

      // Check user
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authenticateorized" });
      }

      await post.deleteOne();

      res.json({ msg: "Post removed" });
    } catch (err) {
      console.error(err.message);

      res.status(500).send("Server Error");
    }
  }
);

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
postRouter.put(
  "/like/:id",
  authenticate,
  checkObjectId("id"),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      // Check if the post has already been liked
      if (post.likes.some((like) => like.user.toString() === req.user.id)) {
        return res.status(400).json({ msg: "Post already liked" });
      }

      post.likes.unshift({ user: req.user.id });

      await post.save();

      return res.json(post.likes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private
postRouter.put(
  "/unlike/:id",
  authenticate,
  checkObjectId("id"),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      // Check if the post has not yet been liked
      if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
        return res.status(400).json({ msg: "Post has not yet been liked" });
      }

      // remove the like
      post.likes = post.likes.filter(
        ({ user }) => user.toString() !== req.user.id
      );

      await post.save();

      return res.json(post.likes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private
postRouter.post(
  "/comment/:id",
  authenticate,
  checkObjectId("id"),
  check("text", "Text is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
postRouter.delete(
  "/comment/:id/:comment_id",
  authenticate,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      // Pull out comment
      const comment = post.comments.find(
        (comment) => comment.id === req.params.comment_id
      );
      // Make sure comment exists
      if (!comment) {
        return res.status(404).json({ msg: "Comment does not exist" });
      }
      // Check user
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }

      post.comments = post.comments.filter(
        ({ id }) => id !== req.params.comment_id
      );

      await post.save();

      return res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

export default postRouter;
