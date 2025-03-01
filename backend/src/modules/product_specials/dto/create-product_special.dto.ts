export class CreateProductSpecialDto {
    special_name: string;
    discount_percentage: number;
    start_date?: Date;
    end_date?: Date;
    productId: number;
}
