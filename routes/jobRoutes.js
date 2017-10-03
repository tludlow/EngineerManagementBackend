const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/config");
const User = require("../database/User");
const ObjectId = require('mongoose').Types.ObjectId;
const Job = require("../database/Job");

router.get("/getJobs", async (req, res)=> {
	//Get the 10 most recent stories.
	var docs = await Job.find({}).limit(10).select("-__v").sort({createdAt: "desc"});
	if(docs.length > 0) {
		console.log(docs);
		res.status(200).send({ok: true, docs});
		return;
	} else {
		res.status(200).send({ok: false, error: "There are no jobs... maybe you can create some?"});
	}
});

router.post("/addJob", async (req, res)=> {
	const { createdBy, title, body, assignedTo } = req.body;
	const auth = req.get("authorization");
	if(!auth || typeof auth === "undefined") {
		res.status(200).send({ok: false, error: "You must be signed in to add a job... sorry."});
		return;
	}

	const token = auth.split(" ")[1];
	//Verify the token is good
	var decodedToken = await jwt.verify(token, jwtSecret);
	if(author != decodedToken.data.username) {
		res.status(200).send({ok: false, error: "Your author name and token username don't match, try relogging."});
		return;
	}
	let verifiedPostCheck = false;
	if(decodedToken.data.role == "admin") {
		verifiedPostCheck = true;
	}
	var newJob = new Job();
	newJob.createdBy = decodedToken.data.username;
	newJob.title = title;
	newJob.body = body;
	newJob.assignedTo = assignedTo;
	newJob.save((err)=> {
		if(err) {
			res.status(200).send({ok: false, error: "There was an error saving your job."});
		} else {
			res.status(200).send({ok: true, post: newStorie});
		}
	});
});


module.exports = router;