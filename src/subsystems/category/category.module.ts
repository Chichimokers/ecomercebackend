import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CategoryEntity, SubCategoryEntity } from "./entity/category.entity";
import { CategoryController } from "./controller/category.controller";
import { SubCategoryController } from "./controller/subcategory.controller";
import { CategoryService } from "./services/category.service";
import { SubCategoryService } from "./services/subcategory.service";


@Module({
  imports:[
    TypeOrmModule.forFeature([CategoryEntity, SubCategoryEntity]),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [CategoryController, SubCategoryController],
  providers: [CategoryService, SubCategoryService],
  exports: [CategoryService, SubCategoryService],
})
export class CategoryModule {}
