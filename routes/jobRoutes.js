const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/config");
const User = require("../database/User");
const ObjectId = require('mongoose').Types.ObjectId;
const Job = require("../database/Job");

router.get("/getJobs", async (req, res)=> {
	//Get the 10 most recent stories.
	var docs = await Job.find({}).select("-__v").sort({dateDue: "asc"});
	//var docs = await Job.find({}).limit(10).select("-__v").sort({createdAt: "desc"});  UNCOMMENT THIS TO ALLOW FOR LIMITING OF HOW MANY JOBS ARE LOADED
	if(docs.length > 0) {
		res.status(200).send({ok: true, jobs: docs});
		return;
	} else {
		res.status(200).send({ok: false, error: "There are no jobs... maybe you can create some?"});
	}
});

router.post("/addJob", async (req, res)=> {
	const { title, body, assignee, date } = req.body;
	const auth = req.get("authorization");
	if(!auth || typeof auth === "undefined") {
		res.status(200).send({ok: false, error: "You must be signed in to add a job... sorry."});
		return;
	}

	const token = auth.split(" ")[1];
	//Verify the token is good
	var decodedToken = await jwt.verify(token, jwtSecret);
	var newJob = new Job();
	newJob.createdBy = decodedToken.data.username;
	newJob.title = title;
	newJob.body = body;
	newJob.assignedTo = assignee;
	newJob.dateDue = date;
	newJob.save((err)=> {
		if(err) {
			res.status(200).send({ok: false, error: "There was an error saving your job."});
		} else {
			res.status(200).send({ok: true, job: newJob});
		}
	});
});

router.get("/getjob/:jobid", async (req, res)=> {
	var jobid = req.params.jobid;
	var jobData = await Job.findOne({_id: new ObjectId(jobid)});

	if(!jobData) {
		res.status(200).send({ok: false, error: "That job doesnt exist."});
	} else {
		res.status(200).send({ok: true, jobData});
	}
});


module.exports = router;