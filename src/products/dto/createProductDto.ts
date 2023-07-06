export class CreateProductDto {
  isInStock: boolean;
  count: number;
  sizes: string;
  color: string;
  soldPrice: number;
  boughtPrice: number;
  title: string;
}
