// src/subsystems/public/tests/public.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicController } from '../controllers/public.controller';
import { PublicService } from '../services/public.service';
import { CategoryEntity } from '../../category/entity/category.entity';
import { CategoryService } from '../../category/services/category.service';
import { SubCategoryEntity } from '../../category/entity/category.entity';
import { ProductEntity } from '../../products/entity/product.entity';
import { ProductService } from '../../products/services/product.service';
import { OrderEntity } from '../../orders/entities/order.entity';
import { OrderProductEntity } from '../../orders/entities/order_products.entity';
import { OrderService } from '../../orders/services/orders.service';
import { UserService } from '../../user/service/user.service';
import { User } from '../../user/entities/user.entity';
import { RatingEntity } from '../../rating/entity/rating.entity';
import { DiscountEntity } from '../../discounts/entity/discounts.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPublicController } from '../controllers/userpublic.controller';
import { TestPostgresDataSource } from "../../../../typeorm.config";

describe('PublicController', () => {
    let controller: PublicController;
    let service: PublicService;
    let categoryService: CategoryService;
    let categoryRepository: Repository<CategoryEntity>;
    let subCategoryRepository: Repository<SubCategoryEntity>;
    let productRepository: Repository<ProductEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot(TestPostgresDataSource.options),
                TypeOrmModule.forFeature([
                    CategoryEntity,
                    SubCategoryEntity,
                    ProductEntity,
                    OrderEntity,
                    OrderProductEntity,
                    User,
                    RatingEntity,
                    DiscountEntity,
                ]),
            ],
            controllers: [PublicController, UserPublicController],
            providers: [
                PublicService,
                OrderService,
                UserService,
                ProductService,
                CategoryService,
                {
                    provide: getRepositoryToken(CategoryEntity),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(SubCategoryEntity),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(ProductEntity),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(OrderEntity),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(OrderProductEntity),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(RatingEntity),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(DiscountEntity),
                    useClass: Repository,
                },
            ],
        }).compile();

        controller = module.get<PublicController>(PublicController);
        service = module.get<PublicService>(PublicService);
        categoryService = module.get<CategoryService>(CategoryService);
        categoryRepository = module.get<Repository<CategoryEntity>>(
            getRepositoryToken(CategoryEntity),
        );
        subCategoryRepository = module.get<Repository<SubCategoryEntity>>(
            getRepositoryToken(SubCategoryEntity),
        );
        productRepository = module.get<Repository<ProductEntity>>(
            getRepositoryToken(ProductEntity),
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});