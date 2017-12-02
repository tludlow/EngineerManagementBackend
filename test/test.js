var chai = require('chai');
var server = require('../index.js');
var should = chai.should();
var expect = chai.expect();
var axios = require("axios");

describe("Job Testing", function() {
    it("Should return an error as no jwt token given", function(done) {
        axios.get("http://localhost:7770/job/getJobsAndLocations/meow").then((res)=> {
            res.should.have.status(404);
            done();
        }).catch((err)=> {
            res.should.have.status(404);
            done();
        });
    });

    it("Should return all jobs as we have provided a token", function(done) {
        axios.get("http://localhost:7770/job/getJobsAndLocations/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoiVGhvbWFzSXNDb29sIiwiZW1haWwiOiJ0aG9tYXNpc2Nvb2xAdGVzdC5tZSIsInJvbGUiOiJ1c2VyIiwidmVyaWZpZWQiOmZhbHNlfSwiaWF0IjoxNTEyMjI1MjU1fQ.uDoqtYP7tOU5E5ukQPpXhBmHJ24hPJ_vf-hPG5iVqH0").then((res)=> {
            expect(res).to.be.an("object");
            expect(res).to.include({ok: true});
            done();
        }).catch((err)=> {
            expect(err).to.be.an("error");
        });
    });
});