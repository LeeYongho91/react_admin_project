import { IsString, IsInt } from 'class-validator';

export class uploadDto {
  @IsString()
  public writer: string;

  @IsString()
  public title: string;

  @IsString()
  public description: string;

  @IsInt()
  public price: number;

  @IsString({ each: true })
  public images: Array<string>;
}

export class getProductDto {
  @IsInt()
  public skip: number;

  @IsInt()
  public limit: number;

  // @IsString()
  // public searchTerm: string;

  // @IsString()
  // public filters: object;

  // @IsBoolean()
  // public loadMore: boolean;
}

export class reviewDto {
  @IsString()
  public productId: string;
  @IsString()
  public description: string;
}
