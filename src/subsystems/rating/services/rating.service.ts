import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RatingEntity } from "../entity/rating.entity";
import { Repository, In } from "typeorm";
import { RateProductDTO } from "../dto/rateProduct.dto";
import { User } from "../../user/entities/user.entity";
import { captureNotFoundException } from "../../../common/exceptions/modular.exception";

@Injectable()
export class RatingService {
    constructor(
        @InjectRepository(RatingEntity)
        private readonly ratingRepository: Repository<RatingEntity>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
    }

    public async rateProducts(userId: string, dto: RateProductDTO): Promise<void> {
        const user: User = await this.userRepository.findOne({
            where: { id: userId },
        });

        captureNotFoundException(user, 'User');

        const existingRatings = await this.ratingRepository.find({
            where: {
                user: user,
                product: In(dto.products)
            }
        });

        const ratingMap = new Map(existingRatings.map(rating => [rating.product.id, rating]));

        // Preparar calificaciones para guardar
        const ratingsToSave = [];

        for (const productId of dto.products) {
            if (ratingMap.has(productId)) {
                // Actualizar calificación existente
                const rating = ratingMap.get(productId);
                rating.rate = dto.rate;
                ratingsToSave.push(rating);
            } else {
                // Crear nueva calificación
                const newRating = this.ratingRepository.create({
                    user: user,
                    product: { id: productId },
                    rate: dto.rate,
                });
                ratingsToSave.push(newRating);
            }
        }

        // Guardar todas las calificaciones en una operación
        await this.ratingRepository.save(ratingsToSave);
    }

    async getAvgRating(): Promise<number> {
        // Build a query to take the avg of the rating
        const resul = await this.ratingRepository.average("rate");
        console.log(resul);
        const result = await this.ratingRepository
            .createQueryBuilder("rating")
            .select("AVG(rating.rate)", "avg")
            .getRawOne();

        return parseFloat(result.avg);
    }
}