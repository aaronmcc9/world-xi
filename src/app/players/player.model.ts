import { Position } from "./player-position";

export class Player{

    constructor(public firstName: string, public lastName: string,
        public age: number, public club: string, public country: string,
        public position: string, public imagePath: string,
        public isSelected: boolean = false,
        public id?: string){}
}