declare global {
  class CategoryPattern {
    id: number;
    name: string;
    image: string;
    type: CategoryType;
    status: StatusType;
    createdAt: Date;
    updatedAt: Date;

    restaurantId: number;
    restourant: RestaurantPattern;
    tables: TablePattern[];
    products: ProductPattern[];
    translations: TranslationPattern[];
  }
  type CategoryType = "PRODUCT" | "TABLE";
}
export {};
