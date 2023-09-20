declare global {
  class IngredientPattern {
    id: number;
    name: string;
    barcode: string;
    quantityType: QuantityTypesType;
    status: StatusType;
    createdAt: Date;
    updatedAt: Date;
    translations: TranslationPattern[];
    ingredientStock: IngredientStockPattern[];
    stokcs: StockPattern[];
    restaurantId: number;
    restaurant: RestaurantPattern;
  }

  class IngredientStockPattern {
    id: number;
    quantity: number;
    status: StatusType;
    createdAt: Date;
    updatedAt: Date;

    stockCodeId: number;
    stockCode: StockCodePattern;
    productId: number;
    product: ProductPattern;
    modifierProductId: number;
    modifierProduc: ModifierProductPattern;
    ingredientId: number;
    ingredient: IngredientPattern;
    stokcs: StockPattern[];
  }
}
export {};
