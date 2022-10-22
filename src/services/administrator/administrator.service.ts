import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lookupService } from 'dns';
import { Administrator } from 'entities/administrator.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { AddAdministratorDto } from 'src/dtos/administrator/add.administrator.dto';
import { EditAdministratorDto } from 'src/dtos/administrator/edit.administrator.dto';

@Injectable()
export class AdministratorService {
    constructor(@InjectRepository(Administrator) private readonly administrator: Repository<Administrator>,
    ){}

 getAll(): Promise<Administrator[]>{
    return this.administrator.find();
}

getById(id: number): Promise<Administrator> {
    return this.administrator.findOneBy({
        administratorId: id
    });
}

add(data: AddAdministratorDto): Promise<Administrator>{
    const passwordHash= crypto.createHash('sha512');
    passwordHash.update(data.password);
    const passwordHashString = passwordHash.digest('hex').toUpperCase();

    let newAdmin: Administrator= new Administrator();
    newAdmin.username= data.username;
    newAdmin.passwordHash= passwordHashString;

    return this.administrator.save(newAdmin);

}

async editById(id: number, data: EditAdministratorDto): Promise<Administrator>{
    let admin: Administrator= await this.administrator.findOneBy({
        administratorId: id
    });
   const passwordHash= crypto.createHash('sha512');
   passwordHash.update(data.password);
   const passwordHashString = passwordHash.digest('hex').toUpperCase();
   admin.passwordHash= passwordHashString;
return this.administrator.save(admin);
}
}

