import User from "User";
import Location from "Location";

export class Job {

    constructor(title, body, createdBy, assignedTo, dateDue, location) {
        this.title = title;
        this.body = body;
        this.createdBy = new User(createdBy);
        this.assignedTo = [User];
        this.dateDue = dateDue;
        this.location = new Location(location);
    }

    get title() {
        return this.title;
    }
    get body() {
        return this.body;
    }
    get createdBy(){
        return this.createdBy;
    }
    get assignedTo(){
        return this.assignedTo;
    }
    get dateDue(){
        return this.dateDue;
    }
    get location(){
        return this.location;
    }
    set title(title) {
        this.title = title;
    }
    set body(body) {
        this.body = body;
    }
    set createdBy(createdBy) {
        this.createdBy = new User(createdBy);
    }
    set assignedTo(assignedTo) {
        assigned.map((user) => {
            this.assignedTo = new User(user);
        });
    }
    set dateDue(dateDue) {
        this.dateDue = dateDue;
    }
    set location(location) {
        this.location = new Location(location);
    }
}