import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lookupService } from 'dns';
import { Administrator } from 'entities/administrator.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { AddAdministratorDto } from 'src/dtos/administrator/add.administrator.dto';
import { EditAdministratorDto } from 'src/dtos/administrator/edit.administrator.dto';
import { ApiResponse } from 'src/misconvenience/api.response.class';

@Injectable()
export class AdministratorService {
    constructor(@InjectRepository(Administrator) private readonly administrator: Repository<Administrator>,
    ){}

 getAll(): Promise<Administrator[]>{
    return this.administrator.find();
}

async getById(id: number): Promise<Administrator | ApiResponse> {
    let admin: Administrator=  await this.administrator.findOneBy({
        administratorId: id
    });
    if(admin === null){
        return new Promise((resolve)=>
        {
            resolve(new ApiResponse("error", -1002));
        });
    }
    return admin;
}

add(data: AddAdministratorDto): Promise<Administrator | ApiResponse>{
    const passwordHash= crypto.createHash('sha512');
    passwordHash.update(data.password);
    const passwordHashString = passwordHash.digest('hex').toUpperCase();

    let newAdmin: Administrator= new Administrator();
    newAdmin.username= data.username;
    newAdmin.passwordHash= passwordHashString;

    return new Promise((resolve)=>{
        this.administrator.save(newAdmin)
        .then(data => resolve(data))
        .catch(error=>{
            const response: ApiResponse= new ApiResponse("error", -1001);
            resolve(response);
        });
    });
}
    

async editById(id: number, data: EditAdministratorDto): Promise<Administrator | ApiResponse>{
    let admin: Administrator= await this.administrator.findOneBy({
        administratorId: id
    });
    if(admin === null){
        return new Promise((resolve)=>{
            resolve(new ApiResponse("error", -1002));
        } );
    }
   const passwordHash= crypto.createHash('sha512');
   passwordHash.update(data.password);
   const passwordHashString = passwordHash.digest('hex').toUpperCase();
   admin.passwordHash= passwordHashString;
return this.administrator.save(admin);
}




}

