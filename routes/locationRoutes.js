const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/config");
const User = require("../database/User");
const Job = require("../database/Job");
const Location = require("../database/Location");

router.get("/getLocations", async (req, res)=> {
    try {
        var gottenLocations = await Location.find({});
        if(!gottenLocations) {
            res.status(200).send({ok: false, error: "There was no locations found."});
        }
        res.status(200).send({ok: true, locations: gottenLocations});
    } catch(err) {
        res.status(200).send({ok: false, error: "There was an error getting the location data."});
    }
});

router.post("/addLocation", async (req, res)=> {
    const { title, address, postcode, customer } = req.body;
    try {
        var newLocation = new Location();
        newLocation.title = title;
        newLocation.address = address;
        newLocation.postcode = postcode;
        newLocation.customer = customer;
        newLocation.save((err)=> {
            if(err) {
                res.status(200).send({ok: false, error: "There was an error saving your new job."});
            } else {
                res.status(200).send({ok: true, job: newLocation});
            }
        });
    } catch(err) {
        res.status(200).send({ok: false, error: "There was a problem creating that location."});
    }
});




module.exports = router;