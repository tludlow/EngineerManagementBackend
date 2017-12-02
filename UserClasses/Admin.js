export class Admin extends User {
    
    constructor(adminLevel) {
        super();
        this.role = "admin"
        this.adminLevel = adminLevel;
    }

    set adminLevel(adminLevel) {
        this.adminLevel = adminLevel;
    }

    get adminLevel() {
        return this.adminLevel;
    }

    verfiyActionWithLevel(levelRequired) {
        if(levelRequired > this.adminLevel) {
            return false;
        }
        return true;
    }
}