
export class UserExportDto{
    module : { id : number };
    id : number;
    area : { id : number };
    ids : number[];    
    paginator : {
        offset : number,
        sort : string,
        order : string,
        limit : number
    }
}