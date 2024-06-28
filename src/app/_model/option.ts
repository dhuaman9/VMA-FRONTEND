export class Option {
    id: number;
    code: string;
    name: string;
    desc: string;
    
    constructor(id, code, name, desc) {
      this.id = id;
      this.code = code;
      this.name = name;
      this.desc = desc;
    }
  }