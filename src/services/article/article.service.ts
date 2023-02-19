import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { ArticleFeature } from "src/entities/article-feature.entity";
import { ArticlePrice } from "src/entities/article-price.entity";

import { Article } from "src/entities/article.entity";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { ApiResponse } from "src/misconvenience/api.response.class";

import { Repository } from "typeorm";
import { ArticleSearchDto } from "src/dtos/article/article.search.dto";
import { Order } from "src/entities/order.entity";

@Injectable()
export class ArticleService extends TypeOrmCrudService<Article>{
    constructor(
        @InjectRepository(Article)
            private readonly article: Repository<Article>,

         @InjectRepository(ArticlePrice)
            private readonly articlePrice: Repository<ArticlePrice>,

         @InjectRepository(ArticleFeature)
            private readonly articleFeature: Repository<ArticleFeature>

    ){
        super(article);
        }

    async createFullArticle(data: AddArticleDto): Promise <Article | ApiResponse> {
        let newArticle: Article = new Article();

        newArticle.name = data.name;
        newArticle.categoryId= data.categoryId;
        newArticle.excerpt= data.excerpt;
        newArticle.description = data.description;

        let savedArticle = await this.article.save(newArticle);

        let newArticlePrice: ArticlePrice = new ArticlePrice();
        newArticlePrice.articleId = savedArticle.articleId;
        newArticlePrice.price= data.price;
        await this.articlePrice.save(newArticlePrice);

        for(let feature of data.features){
            let newArticleFeature: ArticleFeature = new ArticleFeature();
            newArticleFeature.articleId= savedArticle.articleId;
            newArticleFeature.featureId = feature.featureId;
            newArticleFeature.value= feature.value;

           await  this.articleFeature.save(newArticleFeature);

        }
        return await this.article.findOne({where:
            {articleId: savedArticle.articleId},
                relations: {
                    category: true,
                    articleFeatures: true,
                    features: true,
                    articlePrices: true
            }}
            );

    }

    async search(data: ArticleSearchDto): Promise<Article[]>{
        const builder = await this.article.createQueryBuilder("article");
        
        builder.innerJoin("article.articlePrices", "ap");
        builder.leftJoin("article.articleFeatures", "af");
        builder.where('article.categoryId = :categoryId', {
            categoryId: data.categoryId
        });
        if(data.keywords && data.keywords.length > 0){
            builder.andWhere('article.name LIKE :kw OR article.excerpt LIKE :kw OR article.description LIKE :kw',
            {kw: '%' + data.keywords.trim() + '%' });
        }

        if(data.priceMin && typeof data.priceMin === 'number' ){
            builder.andWhere('ap.price >= :min', {min: data.priceMin});
        }
        if(data.priceMax && typeof data.priceMax === 'number' ){
            builder.andWhere('ap.price <= :max', {max: data.priceMax});
        }

        if(data.features && data.features.length > 0){
            for(const feature of data.features){
                builder.andWhere('af.featureId = :fId AND af.value in (:fVals)',
                 {
                    fId: feature.featureId,
                    fVals: feature.values,
                    
                 });
            }
        }

        let orderBy = 'article.name';
        let orderDirection : 'ASC' | 'DESC'= 'ASC';
        if(data.orderBy ){
            orderBy = data.orderBy;
            if(orderBy = 'price'){
                orderBy = 'af.price';
            }
        }

        if(data.orderDirection ){
            orderDirection = data.orderDirection;
        }
        builder.orderBy(orderBy, orderDirection);
        let page =0;
        let perPage: 5 | 10 | 25 | 50 | 75 = 25;
        if(data.page && typeof data.page === 'number'){
            page = data.page;
        }

        if(data.itemsPerPage && typeof data.itemsPerPage === 'number'){
            perPage= data.itemsPerPage;
        }

        builder.skip(page*perPage);
        builder.take(perPage);
        let items = await builder.getMany();
        return items;

    }
    
    

}