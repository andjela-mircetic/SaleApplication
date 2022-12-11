export class LoginInfoAdministratorDto{
    administratorId: number;
    username: string;
    token: string;

    constructor(id:number, un: string, tkn: string){
        this.administratorId= id;
        this.username = un;
        this.token = tkn;
    }
}