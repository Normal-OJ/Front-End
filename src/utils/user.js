export default class User {
    constructor(token) {
        // get payload section and decode base64
        token = atob(token.split('.')[1]);
        // copy user keys
        Object.assign(this, JSON.parse(token).data);
    }

    getUsername() {
        if(this.active !== true) return null;
        return this.username;
    }
}
