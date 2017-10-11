const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/config");
const User = require("../database/User");
const Job = require("../database/Job");

router.post("/signup", async (req, res)=> {
	const { username, password, email } = req.body;
	
	//Check to make sure the user doesn't already exist, this is server side for extra security.
	User.findOne({ $or:[ {username: {'$regex': username,$options:'i'}}, {email: {'$regex': email,$options:'i'}} ]}, function (err, docs) {
        if (docs){
        	res.status(200).send({error: "A user with either that email or username exists."});
        	return;
        }
    });
    
	//Seems that we are good to make the user in our database!
	var newUser = new User();
	newUser.username = username;
	newUser.email = email;
	newUser.password = newUser.generateHash(password);
	
	newUser.save((err)=> {
		if(err) {
			res.status(200).send({error: "There was an error creating your user."});
		} else {
			const data = {username, email, role: "user", verified: false};
			const token = jwt.sign({data}, jwtSecret);
			res.status(200).send({token, username, verified: false});
		}
	});
});

router.post("/signupCheck", async (req, res)=> {
	const { username, email } = req.body;
	
	//Check if a user with either the username or the email specific exists, if so reject the user signing up.
	User.findOne({ $or:[ {username: {'$regex': username,$options:'i'}}, {email: {'$regex': email,$options:'i'}} ]}, function (err, docs) {
        if (docs){
        	res.status(200).send({error: "A user with either that email or username exists."});
        	return;
        } else {
			res.status(200).send({ok: true});
			return;
        }
    });
});

router.post("/login", async (req, res)=> {
	const { username, password} = req.body;
	User.findOne({username: {'$regex': username, $options:'i'}}, function (err, docs) {
        if (docs){
        	if(docs.validPassword(password)) {
			const data = {username, role: docs.role, verified: docs.verified};
			const token = jwt.sign({data}, jwtSecret);
   			res.status(200).send({token, username, verified: docs.verified});
        	} else {
        		res.status(200).send({ok: false, error: "Your password doesn't match that of the account name you gave us."});
        	}
        } else {
            res.status(200).send({ok: false, error: "That account doesn't exist."});
        }
    });
});

router.get("/profile/:profileName", async (req, res)=> {
	const profileName = req.params.profileName;
	try {
		var dataUser = await User.findOne({username: {'$regex': profileName, $options:'i'}}).select("-__v -password -_id");
		var userJobs = await Job.find({assignedTo: profileName}).limit(10);
		res.status(200).send({ok: true, profileData: dataUser, userJobs});
	} catch(err) {
		res.status(200).send({ok: false, error: "There was an error getting that user's data."});
	}
});


module.exports = router;