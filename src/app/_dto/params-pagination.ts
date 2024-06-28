
export class ParamsPagination { 
    constructor(
        public page?: number,
        public first?: number,
        public rows?: number,
        public pageCount?: number
    ){}
}