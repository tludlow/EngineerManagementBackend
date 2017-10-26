export class User {
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = "user";
    }

    get username() {
        return this.username;
    }

    set username(username) {
        this.username = username;
    }

    get email() {
        return this.email;
    }

    set email(email) {
        this.username =email;
    }

    get password() {
        return this.password;
    }
    
    set password(password) {
        this.username = password;
    }

    get role() {
        return this.role;
    }

    set role(role) {
        this.username = role;
    }

    approveAction(level) {
        if(level == "admin" && this.role == "user") {
            return false;
        }
        return true;
    }
}