import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Article } from "./article.entity";
import { Feature } from "./feature.entity";
import * as Validator from 'class-validator';

@Index("fk_article_feature_article_id", ["articleId"], {})
@Index("uq_article_feature_feature_id_article_id", ["featureId", "articleId"], {
  unique: true,
})
@Entity("article_feature")
export class ArticleFeature {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "article_feature_id",
    unsigned: true,
  })
  articleFeatureId: number;

  @Column("int", { name: "feature_id", unsigned: true, default: () => "'0'" })
  featureId: number;

  @Column("varchar", { name: "value", length: 255, default: () => "'0'" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(0,255)
  value: string;

  @Column("int", { name: "article_id", unsigned: true, default: () => "'0'" })
  articleId: number;

  @ManyToOne(() => Article, (article) => article.articleFeatures, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "article_id", referencedColumnName: "articleId" }])
  article: Article;

  @ManyToOne(() => Feature, (feature) => feature.articleFeatures, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "feature_id", referencedColumnName: "featureId" }])
  feature: Feature;
}
