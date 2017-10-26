import axios from "axios";
import User from "../UserClasses/User";
export class Location {
    constructor(title, address, postcode, customer) {
        this.title = title;
        this.address = address;
        this.postcode = postcode
        this.customer = new User();
        this.lat = getLatitude();
        this.lng = getLongitude();

    }

    getLongitude(postcode) {
        axios.get("https://api.postcodes.io/postcodes/" + postcode).then((response)=> {
            return response.result.longitude;
        }).catch((err)=> {
            return false;
        });
    }

    getLatitude(postcode) {
        axios.get("https://api.postcodes.io/postcodes/" + postcode).then((response)=> {
            return response.result.latitude;
        }).catch((err)=> {
            return false;
        });
    }

    get title() {
        return this.title;
    }

    get address() {
        return this.address;
    }

    get postcode() {
        return this.postcode;
    }

    get customer() {
        return this.customer;
    }

    set title(title){
        this.title = title;
    }

    set address(address) {
        this.address = address;
    }

    set postcode(postcode) {
        this.postcode = postcode;
    }

    
}