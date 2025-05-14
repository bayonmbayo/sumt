export class ProfileClass {

    constructor() {
        this.id = 0;
        this.uuid = "";
        this.role = "";
        this.firstname = "";
        this.name = "";
        this.username = "";
        this.email = "";
        this.password = "";
        this.passwordre = "";
        this.changepassword = false;
    }
}

export class CredentialClass {

    constructor() {
        this.email = "";
        this.password = "";
    }
}

export class PasswordClass {

    constructor() {
        this.password = "";
        this.passwordre = "";
        this.token = "";
    }
}