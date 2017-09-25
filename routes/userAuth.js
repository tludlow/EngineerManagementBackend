const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/config");
const User = require("../database/User");
const Storie = require("../database/Storie");

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
			res.status(200).send({token, username});
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
   			res.status(200).send({token, username});
        	} else {
        		res.status(200).send({ok: false, error: "Your password doesn't match that of the account name you gave us."});
        	}
        } else {
            res.status(200).send({ok: false, error: "That account doesn't exist."});
        }
    });
});

router.get("/getRank/:username", async (req, res)=> {

	//IN THE FUTURE THIS COULD BE DONE FROM THE USERS TOKEN AS WE STORE THEIR RANK IN IT.
	const profileName = req.params.username;
	User.findOne({username: {'$regex': profileName, $options: 'i'}}, function(err, docs) {
		if(err) {
			res.status(200).send({ok: false, error: "There was an error getting that username's information"});
		} else {
			res.status(200).send({ok: true, role: docs.role});
		}
	});
});

router.get("/getProfile/:profileName", async (req, res)=> {
	//Check if the profile actually does exist.
	const profileName = req.params.profileName;
	try {
		var gottenUser = await User.findOne({username: {'$regex': profileName, $options: 'i'}});
		var gottenPosts = await Storie.find({author: profileName}).limit(6).select("-__v").sort({createdAt: "desc"});

		if(!gottenUser) {
			res.status(200).send({ok: false, error: "That user doesn't exist."});
			return;
		}
		var returnObject = {username: gottenUser.username, createdAt: gottenUser.createdAt, verified: gottenUser.verified, role: gottenUser.role, posts: gottenPosts};
		res.status(200).send({ok: true, profile: returnObject});
	} catch(e) {
		res.status(200).send({ok: false, error: "We couldn't retrieve the profile data."});
	}
	// User.findOne({username: {'$regex': profileName, $options: 'i'}}, function(err, docs) {
	// 	if(err) {
	// 		res.status(200).send({ok: false, error: "There was an error getting that username's information."});
	// 	}
	// 	if(!docs) {
	// 		res.status(200).send({ok: false, error: "That user doesn't exist."});
	// 	}
		
	// 	var returnObject = {username: docs.username, createdAt: docs.createdAt, verified: docs.verified, role: docs.role, posts: gottenPosts};
	// 	res.status(200).send({ok: true, profile: returnObject});
	// });
});

module.exports = router;