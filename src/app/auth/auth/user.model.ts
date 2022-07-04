export class User {

    constructor(public email: string,
        public id: string,
        private _authToken: string,
        private _expiresIn: Date) { }

        get authToken(){
            return this._authToken;
        }
}