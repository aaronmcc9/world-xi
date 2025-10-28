import { Position } from "./player-position";

export interface PlayerDto {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    club: string;
    country: string;
    position: Position;
    isSelected: boolean;
    photoBlobName?: string;
    photoUrl?: string;
}