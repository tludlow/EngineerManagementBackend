const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/config");
const User = require("../database/User");
const ObjectId = require('mongoose').Types.ObjectId;
const Job = require("../database/Job");
const Location = require("../database/Location");

router.get("/getJobsAndLocations", async (req, res)=> {
	//Get the 10 most recent stories.
	try {
		var foundJobs = await Job.find({}).select("-__v").sort({dateDue: "asc"});
		var foundLocations = await Location.find({});
		//var docs = await Job.find({}).limit(10).select("-__v").sort({createdAt: "desc"});  UNCOMMENT THIS TO ALLOW FOR LIMITING OF HOW MANY JOBS ARE LOADED
	} catch(err) {
		res.status(200).send({ok: false, error: "There was an error requesting the data."});
		return;
	}
	
	res.status(200).send({ok: true, jobs: foundJobs, locations: foundLocations});
});

router.post("/addJob", async (req, res)=> {
	const { title, body, assignee, date, location } = req.body;
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
	newJob.location = location;
	newJob.save((err)=> {
		if(err) {
			res.status(200).send({ok: false, error: "There was an error saving your job."});
		} else {
			res.status(200).send({ok: true, job: newJob});
		}
	});
});

router.get("/getjob/:jobid", async (req, res)=> {
	const jobid = req.params.jobid;
	var jobData = await Job.findOne({_id: new ObjectId(jobid)});
	var locationInfo = await Location.findOne({title: jobData.location});

	if(!jobData) {
		res.status(200).send({ok: false, error: "That job doesnt exist."});
	} else {
		res.status(200).send({ok: true, jobData, lat: locationInfo.lat, lng: locationInfo.lng});
	}
});

router.get("/deletejob/:jobid", async (req, res)=> {
	const jobid = req.params.jobid;
	try {
		await Job.findOneAndRemove({_id: new ObjectId(jobid)});
		res.status(200).send({ok: true});
	} catch(error) {
		res.status(200).send({ok: false, error: "There was an error deleting that job."});
	}
});


module.exports = router;