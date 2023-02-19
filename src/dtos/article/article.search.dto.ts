import * as Validator from 'class-validator';
import { ArticleSearchFeatureComponentDto } from './article.search.feature.component.dto';
export class ArticleSearchDto {
   
    @Validator.IsOptional()
    @Validator.IsString()
    keywords: string;

    @Validator.IsNotEmpty()
    categoryId: number;

    @Validator.IsOptional()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2
    })
    priceMin: number;

    @Validator.IsOptional()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2
    })
    priceMax: number;


    features:ArticleSearchFeatureComponentDto[];

    @Validator.IsOptional()
    orderBy: 'name' | 'price';
    orderDirection: 'ASC' | 'DESC';

    @Validator.IsOptional()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 0
    })
    @Validator.IsPositive()
    page: number;

    @Validator.IsOptional()
    itemsPerPage: 5 | 10 | 25 | 50 | 75;
}