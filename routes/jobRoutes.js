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

//Add a job using the request body data.
router.post("/addJob", async (req, res)=> {
	//Get the request body data we want using javascript destructuring.
	const { title, body, assignee, date, location } = req.body;
	//Get the token for the user used to make sure they are logged in.
	const auth = req.get("authorization");
	if(!auth || typeof auth === "undefined") {
		res.status(200).send({ok: false, error: "You must be signed in to add a job... sorry."});
		return;
	}

	//Split the token, it has a format of BEARER tokenHere, we only want the tokenHere bit so we split at the space and return that bit of the data.
	const token = auth.split(" ")[1];
	//Verify the token is good
	var decodedToken = await jwt.verify(token, jwtSecret);
	//Create the new job object, assign all the data to it.
	var newJob = new Job();
	newJob.createdBy = decodedToken.data.username;
	newJob.title = title;
	newJob.body = body;
	newJob.assignedTo = assignee;
	newJob.dateDue = date;
	newJob.location = location;
	//Save the data to the database, if error send error, if not return the new job data.
	newJob.save((err)=> {
		if(err) {
			res.status(200).send({ok: false, error: "There was an error saving your job."});
		} else {
			res.status(200).send({ok: true, job: newJob});
		}
	});
});

//Get an individual job from the database.
router.get("/getjob/:jobid", async (req, res)=> {
	//Get the job id from the request parameters.
	const jobid = req.params.jobid;

	//Find the job data for the job by it's id, also get the location data for the job from the location table.
	try {
		var jobData = await Job.findOne({_id: new ObjectId(jobid)});
		var locationInfo = await Location.findOne({title: jobData.location});
	
		//If no data, return bad, if data return good.
		if(!jobData || !locationInfo) {
			res.status(200).send({ok: false, error: "That job doesnt exist."});
		} else {
			res.status(200).send({ok: true, jobData, lat: locationInfo.lat, lng: locationInfo.lng});
		}
	} catch(err) { //Catch the catastrophic error.
		res.status(200).send({ok: false, error: "There was an errror getting that individual job's data"});
	}
});

//Delete a job from the database using the job id.
router.get("/deletejob/:jobid", async (req, res)=> {
	///Get the job id from the request parameters
	const jobid = req.params.jobid;
	try {
		//Try and delete, if good return good.
		await Job.findOneAndRemove({_id: new ObjectId(jobid)});
		res.status(200).send({ok: true});
	} catch(error) {
		//There was an error doing the deleting, return the error.
		res.status(200).send({ok: false, error: "There was an error deleting that job."});
	}
});

function quicksort(list) {
	//The list only has one item or less in, so it's already sorted!
	if (list.length <= 1) {
		return list;
	}
	//The point in which to pivot the data around, this honestly can be any piece of data it doesnt need to be the middle.
	var pivotPoint = list[0];

	//The left and the right lists we will use in a minute.
	var leftList = []; 
	var rightList = [];

	//Loop through all the data and sort it into the right list.
	for (var i = 1; i < list.length; i++) {
		list[i] < pivotPoint ? leftList.push(list[i]) : rightList.push(list[i]);
	}
	//Recursive sort and return of the data.
	//Basically one just recursive approach with joining it all together at the end.
	return quicksort(leftList).concat(pivotPoint, quicksort(rightList));
};

//Actually perform the merge sort on the array.
//Uses the function below to actually merge the two lists.
function mergeSort(arr) {
	//If there is no data or just one piece return the original list as it's already sorted!
    if (arr.length < 2)
        return arr;
	
	//Find the middle element, in integer form.
	//Find the left array of original list depending on the middle piece, same for the right.
    var middle = parseInt(arr.length / 2);
    var left   = arr.slice(0, middle);
    var right  = arr.slice(middle, arr.length);
	//Recursively return the data.
    return merge(mergeSort(left), mergeSort(right));
}
 
function merge(left, right) {
	//The list to return once we have merged the original two lists.
    var result = [];
	
	//Compare the data, if the left is before the right in alphabetical put this in first, if not do the right piece of data.
	//Ternary operator to do this so it looks nice.
    while (left.length && right.length) {
		left[0] <= right[0] ? result.push(left.shift()) : result.push(right.shift());
    }
	
	//Shift gets the first element, removes it, returns it. Does this for both the lists while there are actually is data.
	//This is done inline.
    while (left.length)
        result.push(left.shift());
 
    while (right.length)
        result.push(right.shift());
 
    return result;
}

router.get("/jobByAlphabetical", async (req, res)=> {
	try {
		var allJobs = await Job.find({});
	} catch (err) {
		res.status(200).send({ok: false, error: "There was an error getting all the jobs"});
	}

});


module.exports = router;