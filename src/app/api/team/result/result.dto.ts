export interface Result {
    id: number;
    score: string;
    winnerId?: number;
    loserId?: number;
    datetime: Date;
}