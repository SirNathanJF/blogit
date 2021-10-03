const router = require("express").Router();
const { BlogPost, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

// Home route to render list of blog posts
router.get("/", async (req, res) => {
  try {
    const BlogPostData = await BlogPost.findAll({
      include: [{ model: User }],
    });

    const blogEntries = BlogPostData.map((blog) => blog.get({ plain: true }));
    res.render("homepage", {
      blogEntries,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Profile route= renders list of your posts
router.get("/profile", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: BlogPost }],
    });

    const user = userData.get({ plain: true });
    res.render("profile", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Blog Entry route - renders form to create a new post
router.get("/blog-entry", withAuth, async (req, res) => {
  try {
    res.render("blog-entry", {
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Single Blog post route - renders post and all comments
router.get("/blog-post/:id", async (req, res) => {
  try {
    const blogData = await BlogPost.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["user_name"],
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["user_name"],
            },
          ],
          attributes: ["id", "content", "date_created", "commentor_id"],
        },
      ],
    });

    const blog = blogData.get({ plain: true });
    for (let i = 0; i < blog.comments.length; i++) {
      const isMatch = blog.comments[i].commentor_id === req.session.user_id;
      blog.comments[i].isAuthor = isMatch;
    }

    res.render("blog-post", {
      ...blog,
      logged_in: req.session.logged_in,
      current_user: req.session.user_id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Sinlge post - edit option
router.get("/blog-post/edit/:id", async (req, res) => {
  try {
    const blogData = await BlogPost.findByPk(req.params.id);
    const blogPost = blogData.get({ plain: true });

    res.render("blog-edit", {
      ...blogPost,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login route - renders the login page
router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

// Create account route - renders account sign up page
router.get("/create-account", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  res.render("create-account");
});

module.exports = router;
