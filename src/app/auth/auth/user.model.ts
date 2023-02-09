import { List } from "lodash";

export class User {

    constructor(public email: string,
        public id: string,
        public notifications: List<number>,
        private _accessToken: string,
        private _expiresIn: Date) { }

    get accessToken() {
        return this._accessToken;
    }
}