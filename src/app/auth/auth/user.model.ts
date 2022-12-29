export class User {

    constructor(public email: string,
        public id: string,
        private _accessToken: string,
        private _expiresIn: Date) { }

        get accessToken(){
            return this._accessToken;
        }
}