export class CreateProductSpecialDto {
    productId: number;
    specialName: string;
    discountPercentage: number;
    startDate?: Date;
    endDate?: Date;
}
