const app = require("../index");
const request = require("supertest");


//Test that there should be a 404 error when calling an undefined endpoint.
test("It should returns a 404 error when requesting an undefined endpoint.", ()=> {
    return request(app).get("/randomEndpoint").then(response=> {
        expect(response.statusCode).toBe(404);
        expect(response.text).toContain("No Endpoint Found");
    });
});

//Test the /job/getJobs endpoints - should return all jobs created.
test("It should return all jobs created", ()=> {
    return request(app).get("/job/getJobs").then(response=> {
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("jobs");
    });
});