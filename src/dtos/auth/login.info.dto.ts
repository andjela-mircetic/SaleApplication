export class LoginInfoDto{
    id: number;
    identity: string;
    token: string;

    constructor(id:number, un: string, tkn: string){
        this.id= id;
        this.identity= un;
        this.token = tkn;
    }
}