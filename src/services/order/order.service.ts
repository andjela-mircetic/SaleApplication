import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Article } from "src/entities/article.entity";
import { CartArticle } from "src/entities/cart-article.entity";
import { Cart } from "src/entities/cart.entity";
import { Order } from "src/entities/order.entity";
import { ApiResponse } from "src/misconvenience/api.response.class";
import { Repository } from "typeorm";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Cart) 
        private readonly cart: Repository<Cart>,

       
        @InjectRepository(Order) 
        private readonly order: Repository<Order>
    ){ }


    async add(cartId: number): Promise<Order | ApiResponse>{
        const order = await this.order.findOneBy({
            cartId: cartId,
        });
        if(order){
            return new ApiResponse("error", -7001, "An order cant be made");
        }
        const cart= await this.cart.findOne({
            where: {
                cartId: cartId,
            },
            relations: [ "cartArticles", ],
        });
    
        if(!cart){
            return new ApiResponse("error", -7002, "An order cant be made");
        }


if(cart.cartArticles.length === 0){
    return new ApiResponse("error", -7003, "An order cant be made");
}
const newOrder: Order = new Order();
newOrder.cartId = cartId;
const savedOrder =await this.order.save(newOrder);

return await this.order.findOne({
    where: {
        orderId: savedOrder.orderId,
    },
    relations: [ "cart", 
    "cart.cartArticles",
     "cart.cartArticles.article", 
     "cart.cartArticles.article.category",
      "cart.user", 
      "cart.cartArticles.article.articlePrices"],
});

    }

}
