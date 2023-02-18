import { Body, Controller, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Crud } from "@nestjsx/crud";
import { StorageConfig } from "config/storage.cofig";
import { Article } from "src/entities/article.entity";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { ArticleService } from "src/services/article/article.service";
import { diskStorage } from "multer";
import { PhotoService } from "src/services/photo/photo.service";
import { Photo } from "src/entities/photo.entity";
import { ApiResponse } from "src/misconvenience/api.response.class";
import { fileName } from "typeorm-model-generator/dist/src/NamingStrategy";
//import * as fileType from "file-type";
import * as sharp from 'sharp';
import { AllowToRoles } from "src/misconvenience/allow.to.roles.descriptor";
import { RoleCheckedGuard } from "src/misconvenience/role.checker.guard";

@Controller('api/article')
@Crud({
    model:{
        type: Article
    },
    params:{
        id:{
            field: 'article_id',
            type: 'number',
            primary:true
        }
    },
        query:{
          join:{
            category:{
                eager:true
            },
            photos:{
                eager:true
            }
            ,articlePrices:{
                eager:true
            },
            articleFeatures:{
                eager:true
            }
          }
        },
        routes:{
            only:[
                'getManyBase',
                'getOneBase'
            ],
            getOneBase:{
                decorators:[
                    UseGuards(RoleCheckedGuard),
                    AllowToRoles('administrator', 'user')
                ],
            },
            getManyBase:{
                decorators:[
                    UseGuards(RoleCheckedGuard),
                    AllowToRoles('administrator', 'user')
                ],
            }

            
        }

    }
)
export class ArticleController{
    constructor(public service: ArticleService,
        public photoService: PhotoService
        ){ }

    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('administrator')
    @Post()
    createFullArticle(@Body() data: AddArticleDto){
        return this.service.createFullArticle(data);
    }

    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('administrator')
    @Post(':id/uploadPhoto/')
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: diskStorage({
                destination: StorageConfig.photo.destination,
                filename: (req, file, callback)=>{
                    let original: string = file.originalname;
                    let normalized = original.replace(/\s+/g, '-');
                    let sada = new Date();
                    let datePart= "";
                    datePart += sada.getFullYear().toString();
                    datePart+= (sada.getMonth() +  1).toString();
                    datePart+= sada.getDate().toString();
                    let randomPart: string = new Array(10)
                    .fill(0).map(e => (Math.random() * 9).toFixed(0).toString())
                    .join('');
                    
                    let fileName = datePart + '-' + randomPart + '-' + normalized;
                    callback(null, fileName);
                }
            }),fileFilter: (req, file, callback)=>{
                // ekstenzija
            if(!file.originalname.toLowerCase().match(/\.(jpg|png)$/)){
                req.fileFilterError = 'Bad file extension!';
                callback(null, false);
            return;}
                //tip sadrzaja
            if(!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))){
                req.fileFilterError = 'Bad file content!';
                callback( null, false);return;
            }
            callback(null, true);
            },
            limits: {
                files: 1,
                fileSize: StorageConfig.photo.maxSize
            }

        })
    )
    async uploadPhoto(@Param ('id') articleId: number, @UploadedFile() photo, @Req() req): Promise<ApiResponse | Photo>{
        if(req.fileFilterError){
            return new ApiResponse('error', -4002, req.fileFilterError);
        }
        if(!photo){
            return new ApiResponse('error', -4002, 'Photo not uploaded');
        }

        /*const fileTypeResult = await fileType.fileTypeFromFile(photo.path);
        if(!fileTypeResult){

            return new ApiResponse('error', -4002, 'Cannot detect type');
        }

        const realMimeType = fileTypeResult.mime;
        if(!(realMimeType.includes('jpeg') || realMimeType.includes('png'))){
            return new ApiResponse('error', -4002, 'Bad file content type');
        }*/

        await this.createThumb(photo);
        await this.createSmallImage(photo);
        
        const newPhoto: Photo = new Photo();
        newPhoto.articleId = articleId;
        newPhoto.imagePath = photo.filename;
        const savedPhoto = await this.photoService.add(newPhoto);
        if(!savedPhoto){
            return new ApiResponse('error', -4001);

        }

        return savedPhoto;

    }

    async createThumb(photo){
        const originalFilePath = photo.path;
        const fileName = photo.filename;

        const destinationFilePath = StorageConfig.photo.destination + StorageConfig.photo.resize.thumb.directory + fileName;
        await sharp(originalFilePath)
        .resize({
            fit: 'cover',
            width: StorageConfig.photo.resize.thumb.width,
            height: StorageConfig.photo.resize.thumb.height,

        }).toFile(destinationFilePath);

    }

    async createSmallImage(photo){
        const originalFilePath = photo.path;
        const fileName = photo.filename;

        const destinationFilePath = StorageConfig.photo.destination + StorageConfig.photo.resize.small.directory + fileName;
        await sharp(originalFilePath)
        .resize({
            fit: 'cover',
            width: StorageConfig.photo.resize.small.width,
            height: StorageConfig.photo.resize.small.height,

        }).toFile(destinationFilePath);

    }

    


}


