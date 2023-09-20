declare global {
  class ProductPattern {
    id: number;
    name: string;
    image: string;
    description?: string;
    originalPrice: number;
    sellingPrice: number;
    quantityType: QuantityTypesType;
    status: StatusType;
    createdAt: Date;
    updatedAt: Date;
    restaurantId: number;
    restourant: RestaurantPattern;
    categoryId: number;
    category: CategoryPattern;
    modifierGroups: ModifierGroupPattern[];
    ingredientStocks: IngredientStockPattern[];
    orderProducts: OrderProductPattern[];
    translations: TranslationPattern[];
  }

  type QuantityTypesType = "PIECE" | "PORTION" | "KILOGRAM" | "GRAM";
}
export {};
