var chai = require('chai');
var server = require('../index.js');
var should = chai.should();
var expect = chai.expect();
var axios = require("axios");



describe("Job Testing", function() {
    it("Should return an error as no jwt token taken", function(done) {
        axios.get("http://localhost:7770/job/getJobsAndLocations/meow").then((res)=> {
            res.should.have.status(404);
            done();
        }).catch((err)=> {
            res.should.have.status(404);
            done();
        });
    });
});