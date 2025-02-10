import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RatingEntity } from "../entity/rating.entity";
import { Repository } from "typeorm";

@Injectable()
export class RatingService {
    constructor(
        @InjectRepository(RatingEntity)
        private readonly ratingRepository: Repository<RatingEntity>,
    ) {
    }

    async getAvgRating(): Promise<number> {
        // Build a query to take the avg of the rating
        const resul = await this.ratingRepository.average('rate');
        console.log(resul);
        const result = await this.ratingRepository
            .createQueryBuilder('rating')
            .select('AVG(rating.rate)', 'avg')
            .getRawOne();

        return parseFloat(result.avg);
    }
}