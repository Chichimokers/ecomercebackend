import {
    Injectable,
    NotFoundException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository, ILike, MoreThan } from "typeorm";
import { BaseService } from "../../../common/services/base.service";
import { ProductEntity } from "../entity/product.entity";
import { UpdateProductDTO } from "../dto/updateProductDTO.dto";
import {
    CategoryEntity,
    SubCategoryEntity
} from "../../category/entity/category.entity";
import { DiscountEntity } from "../../discounts/entity/discounts.entity";
import { IServiceDTOC } from "../../../common/interfaces/base-service.interface";
import { CreateProductDTO } from "../dto/createProductDTO.dto";
import { notFoundException } from "../../../common/exceptions/modular.exception";
import { ProvinceEntity } from "../../locations/entity/province.entity";
import { ratingAVG } from "../utils/ratingAVG";
import { IFilterProduct } from "../../../common/interfaces/filters.interface";
import { applyFilter, applyQueryFilters } from "../../../common/utils/filters.utils";


@Injectable()
export class ProductService
    extends BaseService<ProductEntity>
    implements IServiceDTOC {
    protected getRepositoryName(): string {
        return "tb_products";
    }

    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,
        @InjectRepository(SubCategoryEntity)
        private readonly subCategoryRepository: Repository<SubCategoryEntity>,
        @InjectRepository(DiscountEntity)
        private readonly discountRepository: Repository<DiscountEntity>,
        @InjectRepository(ProvinceEntity)
        private readonly provinceRepository: Repository<ProvinceEntity>
    ) {
        super(productRepository);
    }

    override async findAll(page: number = 0, limit: number = 30, filters: IFilterProduct = {}): Promise<any> {
        const [products, count] = await this.getProductsByORM(filters, page * limit, limit, true, true);

        const urls: {
            previousUrl: string;
            nextUrl: string;
            totalPages: number;
        } = await this.getUrls(page, limit, count, '/products');

        return {
            products: await this.mapProductORM(products),
            urls
        };
    }

    override async findOneById(id: string): Promise<any> {
        const product = await this.productRepository.findOne({
            relations: {
                province: true,
                category: true,
                subCategory: true,
                ratings: true,
                discounts: true,
            },
            select: {
                province: {
                    name: true
                },
                category: {
                    name: true
                },
                subCategory: {
                    name: true
                },
                discounts: {
                    min: true,
                    reduction: true,
                },
            },
            where: {
                id: id
            }
        });

        const mapped = await this.mapProductORM([product])

        return mapped[0];
    }

    async insertByDTO(dto: CreateProductDTO) {
        const { category, subCategory } = await this.getCategoryAndSubCategoryByDTO(dto);

        const province: ProvinceEntity = await this.provinceRepository.findOne({
            where: { id: dto.province }
        });

        notFoundException(province, "Province");

        const product: ProductEntity = this.productRepository.create({
            name: dto.name,
            price: dto.price,
            quantity: dto.quantity,
            short_description: dto.short_description,
            description: dto.description,
            weight: dto.weight,
            category: category,
            image: dto.image,
            subCategory: subCategory,
            province: province
        });

        await this.modifyProductDiscount(dto, product);

        return await this.productRepository.save(product);
    }

    async updateByDTO(id: any, dto: UpdateProductDTO): Promise<ProductEntity> {
        // Buscar el producto
        const product: ProductEntity = await this.productRepository.findOne({
            relations: {
              category: true,
              subCategory: true,
              province: true,
            },
            where: { id }
        });

        notFoundException(product, "Product");

        // Actualizar los campos básicos del producto
        [
            "name",
            "description",
            "short_description",
            "price",
            "quantity",
            "weight",
            "image"
        ].forEach((field: string): void => {
            if (dto[field] !== undefined) {
                if (field === "price" || field === "quantity" || field === "weight") {
                    product[field] = Number(dto[field]);
                } else {
                    product[field] = dto[field];
                }
            }
        });

        const { category, subCategory } =
            await this.getCategoryAndSubCategoryByDTO(dto);

        if (dto.province) {
            const province = await this.provinceRepository.findOne({
                where: { id: dto.province }
            });

            notFoundException(province, "Province");

            product.province = province;
        }

        // Se actualizan categorias y subcategorias
        this.setCategoryAndSubCategory(product, category, subCategory);

        // Apartado del descuento
        await this.modifyProductDiscount(dto, product);

        // Actualizar updated_at
        product.updated_at = new Date();
        // Guardar los cambios
        return await this.productRepository.save(product);
    }

    private async modifyProductDiscount(
        dto: any,
        product: ProductEntity
    ): Promise<void> {
        if (dto.min && dto.reduction) {
            const discount: DiscountEntity = this.discountRepository.create({
                min: dto.min,
                reduction: dto.reduction,
                products: product
            });

            await this.discountRepository.save(discount);
            product.discounts = discount;
        }
    }

    private async getCategoryAndSubCategoryByDTO(dto: any) {
        let category: CategoryEntity = undefined;
        let subCategory: SubCategoryEntity = undefined;

        if (dto.category) {
            category = await this.categoryRepository.findOne({
                where: { id: dto.category }
            });
            notFoundException(category, "Category");
        }

        if (dto.subCategory) {
            subCategory = await this.subCategoryRepository.findOne({
                where: { id: dto.subCategory }
            });
            notFoundException(subCategory, "Subcategory");
        }

        return {
            category: category,
            subCategory: subCategory
        };
    }

    private setCategoryAndSubCategory(
        product: ProductEntity,
        category: CategoryEntity,
        subCategory: SubCategoryEntity
    ): void {
        if (category) {
            product.category = category;
        }

        if (subCategory) {
            product.subCategory = subCategory;
        }
    }


    private async mapProduct(query, slice = false, offset = 0, limit = 0) {
        let item = await query.getRawMany();

        if (slice) {
            item = item.slice(offset, offset + limit);
        }

        return item.map((item) => ({
            id: item.product_id,
            image: item.product_image || undefined,
            name: item.product_name,
            price: item.product_price,
            description: item.product_description,
            short_description: item.product_short_description,
            quantity: item.product_quantity,
            weight: item.product_weight,
            averageRating: parseFloat(item.averageRating) || undefined,
            category:
                item.category_name || item.product_categoryId || undefined,
            subCategory:
                item.subCategory_name ||
                item.product_subCategoryId ||
                undefined,
            discount:
                item.discount_min === null && item.discount_reduction === null
                    ? undefined
                    : {
                        min: item.discount_min,
                        reduction: item.discount_reduction
                    }
        }));
    }

    private async mapProductORM(products: ProductEntity[]) {
        return products.map((product: ProductEntity) => ({
            id: product.id,
            created_at: product.created_at || undefined,
            updated_at: product.updated_at || undefined,
            deleted_at: product.deleted_at || undefined,
            image: product.image || undefined,
            name: product.name,
            price: product.price,
            description: product.description,
            short_description: product.short_description,
            quantity: product.quantity,
            weight: product.weight,
            averageRating: parseFloat(ratingAVG(product.ratings)) || undefined,
            province: product.province.name,
            category:
                product.category.name || product.category.id || undefined,
            subCategory:
                product.subCategory.name ||
                product.subCategory.id ||
                undefined,
            discount:
                !product.discounts || product.discounts.reduction === null
                    ? undefined
                    : {
                        min: product.discounts.min,
                        reduction: product.discounts.reduction
                    }
        }));
    }

    //      *--- Services for public's Endpoints ---*
    //      *--- Get Products Home ---*
    public async getProductsHome(limit: number) {
        const query = this.productRepository
            .createQueryBuilder("product")
            .leftJoin("product.ratings", "rating")
            .leftJoin("product.discounts", "discount")
            .addSelect("AVG(rating.rate)", "averageRating")
            .addSelect(["discount.min", "discount.reduction"])
            .groupBy("product.id")
            .addGroupBy("discount.id")
            .having("COUNT(rating.id) > 0")
            .orderBy("\"averageRating\"", "DESC");

        return this.mapProduct(query, true, 0, limit);
    }

    //      *--- Get Filtered Products ---*
    public async getFilteredProducts(
        filters: IFilterProduct,
        page: number = 0,
        limit: number = 30
    ) {
        const [products, count] = await this.getProductsByORM(filters, page * limit, limit, false, true);

        const urls: {
            previousUrl: string;
            nextUrl: string;
            totalPages: number;
        } = await this.getUrls(page, limit, count, '/public/products');

        return {
            products: await this.mapProductORM(products),
            urls
        };
    }

    //      *--- Search Product by Name ---*
    public async searchProductByName(name: string, province?: string) {
        return await this.productRepository.find({
            relations: {
                category: true,
            },
            select: {
                id: true,
                name: true,
                image: true,
                price: true,
                short_description: true,
                category: {
                    name: true
                },
            },
            where: {
                name: ILike(`%${name}%`),
                quantity: MoreThan(0),
                province: province ? { id: province } : undefined
            },
            skip: 0,
            take: 10
        });
    }

    //      *--- Get Product Detail ---*
    public async getProductDetails(id: string) {
        const filters: IFilterProduct = {
            id: id
        };

        const product = await this.mapProductORM(await this.getProductsByORM(filters));

        return product[0];
    }

    public async getRelations(id: string) {
        const product: ProductEntity = await this.productRepository.findOne({
            where: { id },
            relations: ["category", "subCategory"]
        });

        notFoundException(product, "Product");

        const category: CategoryEntity = product.category;
        const subcategory: SubCategoryEntity = product.subCategory;

        if (!category && !subcategory) {
            throw new NotFoundException("Not found relations");
        }

        const filters: IFilterProduct = {
            notId: id,
            categoryIds: [category.id],
            subCategoryIds: [subcategory.id]
        };

        const products: ProductEntity[] = await this.getProductsByORM(filters, 0, 15);

        return await this.mapProductORM(products);
    }

    public async countProducts(filters?: IFilterProduct): Promise<number> {
        const whereConditions: any = {};

        if (filters?.categoryIds?.length) {
            whereConditions.category = { id: In(filters.categoryIds) };
        }

        if (filters?.subCategoryIds?.length) {
            whereConditions.subCategory = { id: In(filters.subCategoryIds) };
        }

        return await this.productRepository.count({
            where: whereConditions
        });
    }

    public async getMinAndMaxPrice(filters?: IFilterProduct) {
        // Crear el queryBuilder para obtener precios mínimo y máximo
        const queryBuilder = this.productRepository
            .createQueryBuilder('product')
            .select('MIN(product.price)', 'minPrice')
            .addSelect('MAX(product.price)', 'maxPrice');

        // Aplicar joins necesarios para filtros relacionales
        queryBuilder
            .leftJoin('product.category', 'category')
            .leftJoin('product.subCategory', 'subCategory')
            .leftJoin('product.province', 'province');

        // Aplicar filtros si existen
        applyQueryFilters(queryBuilder, filters);

        // Ejecutar la consulta y obtener resultados
        const result = await queryBuilder.getRawOne();

        return {
            minPrice: result.minPrice !== null ? Number(result.minPrice) : 0,
            maxPrice: result.maxPrice !== null ? Number(result.maxPrice) : 0
        };
    }

    private async getUrls(
        page: number,
        limit: number,
        count: number,
        url: string
    ) {
        const totalPages = Math.ceil(count / limit) - 1;

        const previousUrl: string =
            page - 1 <= 0 ? undefined : `${url}?page=${page - 1}`;
        const nextUrl: string =
            page + 1 > totalPages
                ? undefined
                : `${url}?page=${page + 1}`;

        return { previousUrl, nextUrl, totalPages };
    }


    public async getProductsByORM(filters?: IFilterProduct, skip?: number, take?: number, admin?: boolean, count?: false): Promise<ProductEntity[]>;
    public async getProductsByORM(filters?: IFilterProduct, skip?: number, take?: number, admin?: boolean, count?: true): Promise<[ProductEntity[], number]>;
    public async getProductsByORM(
        filters?: IFilterProduct,
        skip: number = 0,
        take: number = 5,
        admin: boolean = false,
        count: boolean = false
    ): Promise<ProductEntity[] | [ProductEntity[], number]> {
        const object = this.getObjectForORM(filters, skip, take, admin);

        if (!count) {
            return await this.productRepository.find(object);
        }

        return await this.productRepository.findAndCount(object);
    }

    private getObjectForORM(filters: IFilterProduct, skip = 0, take = 5, admin: boolean = false) {
        let whereConditions: any;

        if (filters) whereConditions = applyFilter(filters);

        return {
            relations: {
                province: true,
                category: true,
                subCategory: true,
                ratings: admin ? undefined : true,
                discounts: admin ? undefined : true,
            },
            select: {
                id: true,
                image: !admin ? true : undefined,
                name: true,
                price: true,
                description: !admin ? true : undefined,
                short_description: !admin ? true : undefined,
                quantity: true,
                weight: true,
                created_at: admin ? true : undefined,
                updated_at: admin ? true : undefined,
                deleted_at: admin ? true : undefined,
                province: { name: true },
                category: { name: true },
                subCategory: { name: true },
                ...(admin ? {} : {
                    ratings: { rate: true },
                    discounts: { reduction: true, min: true }
                }),
            },
            where: whereConditions,
            skip: skip,
            take: take
        };
    }
}
