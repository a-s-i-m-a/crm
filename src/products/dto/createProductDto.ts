export class CreateProductDto {
  id: string;
  barcode: string;
  isInStock: boolean;
  count: number;
  sizes: string[];
  color: string;
  soldPrice: number;
  boughtPrice: number;
  title: string;
}
