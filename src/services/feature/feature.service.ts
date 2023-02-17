import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Feature } from "src/entities/Feature.entity";
import { Repository } from "typeorm";

@Injectable()
export class FeatureService extends TypeOrmCrudService<Feature>{
    constructor(
        @InjectRepository(Feature)
            private readonly Feature: Repository<Feature>
    ){
        super(Feature);
        }
    
    

}