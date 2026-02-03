import express from "express";
const authRouter = express.Router();

authRouter.get("/", (req, res) => {
  console.log("Session object:", req.session  );
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

export default authRouter;
