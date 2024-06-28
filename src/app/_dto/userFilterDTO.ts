export class UserFilterDTO{
    module : {
        id : number
    };
    id : number;
    ids : number[];
    area : {
        id : number
    };
    paginator : {
        offset : number,
        sort : string,
        order: string,
        limit: number
    }
}