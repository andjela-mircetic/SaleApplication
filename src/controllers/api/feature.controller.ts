import { Controller, UseGuards } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Feature } from "src/entities/feature.entity";
import { AllowToRoles } from "src/misconvenience/allow.to.roles.descriptor";
import { RoleCheckedGuard } from "src/misconvenience/role.checker.guard";
import { FeatureService } from "src/services/feature/feature.service";

@Controller('api/feature')
@Crud({
    model:{
        type: Feature
    },
    params:{
        id:{
            field: 'feature_id',
            type: 'number',
            primary:true
        }
    },
        query:{
            join:{
                articleFeatures:{
                    eager:false
                },
                category:{
                    eager:true
                },
                articles:{
                    eager:false
                }
            }
        },
        routes:{
            only:[
                "createOneBase",
                "createManyBase",
                "getManyBase",
                "getOneBase",
                "updateOneBase",
            ],
            createOneBase: {
                decorators: [
                    UseGuards(RoleCheckedGuard),
                    AllowToRoles('administrator'),

                ]
            },
            createManyBase:{
                decorators: [
                    UseGuards(RoleCheckedGuard),
                    AllowToRoles('administrator'),

                ]
            },
            getManyBase:{
                decorators: [
                    UseGuards(RoleCheckedGuard),
                    AllowToRoles('administrator', 'user'),

                ]
            },
            getOneBase:{
                decorators: [
                    UseGuards(RoleCheckedGuard),
                    AllowToRoles('administrator', 'user'),

                ]
            },
            updateOneBase:{
                decorators: [
                    UseGuards(RoleCheckedGuard),
                    AllowToRoles('administrator'),

                ]
            }
        }

    }
)
export class FeatureController{
    constructor(public service: FeatureService){ }
}


