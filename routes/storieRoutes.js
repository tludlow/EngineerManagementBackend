const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/config");
const User = require("../database/User");
const Storie = require("../database/Storie");
const Comment = require("../database/Comment");
const ObjectId = require('mongoose').Types.ObjectId; 

router.get("/getStories", async (req, res)=> {
	//Get the 10 most recent stories.
	var docs = await Storie.find({}).limit(10).select("-__v").sort({createdAt: "desc"});
	if(docs.length > 0) {
		res.status(200).send({ok: true, docs});
		return;
	} else {
		res.status(200).send({ok: false, error: "There are no stories... maybe you can create some?"});
	}

});

router.post("/addStorie", async (req, res)=> {
	const { author, title, body, category } = req.body;
	const auth = req.get("authorization");
	if(!auth || typeof auth === "undefined") {
		res.status(200).send({ok: false, error: "You must be signed in to add a storie... sorry."});
		return;
	}

	const token = auth.split(" ")[1];
	//Verify the token is good
	var decodedToken = await jwt.verify(token, jwtSecret);
	console.log(decodedToken);
	if(author != decodedToken.data.username) {
		res.status(200).send({ok: false, error: "Your author name and token username don't match, try relogging."});
		return;
	}
	let verifiedPostCheck = false;
	if(decodedToken.data.role == "admin") {
		verifiedPostCheck = true;
	}
	var newStorie = new Storie();
	newStorie.author = decodedToken.data.username;
	newStorie.title = title;
	newStorie.body = body;
	newStorie.category = category;
	newStorie.verifiedUser = verifiedPostCheck;
	newStorie.save((err)=> {
		if(err) {
			res.status(200).send({ok: false, error: "There was an error saving your storie."});
		} else {
			res.status(200).send({ok: true, post: newStorie});
		}
	});
});


router.post("/addComment/:postid/", async (req, res)=> {
	const postId = req.params.postId;
	const { author, body } = req.body;
	const auth = req.get("authorization");

	//Dont allow people to comment who haven't sent their auth token.
	if(!auth || typeof auth === "undefined") {
		res.status(200).send({ok: false, error: "You must be signed into an account to add a comment to a storie."});
		return;
	}
	const token = auth.split(" ")[1];
	//Verify the token is good

	var decodedToken = await jwt.verify(token, jwtSecret);
	if(author != decodedToken.data.username) {
		res.status(200).send({ok: false, error: "Your author name and token username are mismatched, try relogging."});
		return;
	}

	//Check to see if the commenter is of a role which is "verified" or the user is "verified"
	let verifiedCommentCheck = false;
	if(decodedToken.data.role == "admin" || decodedToken.data.vefified === true) {
		verifiedPostCheck = true;
	}

	//Create the new comment.
	var newComment = new Comment();
	newComment.post = postId;
	newComment.author = decodedToken.data.username;
	newComment.body = body;
	newComment.verifiedUser = verifiedCommentCheck;

	//Save the comment, catch any errors and send them back. If no errors, reply that it was all ok and send the comment data back too.
	newComment.save((err)=> {
		if(err) {
			res.status(200).send({ok: false, error: "There was an error saving your comment on that storie.."});
		} else {
			res.status(200).send({ok: true, comment: newComment});
		}
	});

});

router.get("/getPost/:postId", async (req, res)=> {
	const postId = req.params.postId;
	try {
		var gottenPost = await Storie.findOne({_id: new ObjectId(postId)});
		var gottenComments = await Comment.find({post: new ObjectId(postId)});
	} catch(e) {
		res.status(200).send({ok: false, error: "There was an error requesting your data."});
		return;
	}
	res.status(200).send({ok: true, post: gottenPost, comments: gottenComments});
});

module.exports = router;