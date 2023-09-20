declare global {
  class StockPattern {
    id: number;
    quantity: number;
    status: StatusType;
    createdAt: Date;
    updatedAt: Date;

    ingredientStockId: number;
    ingredientStock: IngredientStockPattern;
    ingredientId: number;
    ingredient: IngredientPattern;
    stockCodeId: number;
    stockCode: StockCodePattern;
    restaurantId: number;
    restaurant: RestaurantPattern;
  }

  class StockCodePattern {
    id: number;
    name: String;
    status: StatusType;
    createdAt: Date;
    updatedAt: Date;
    stokcs: StockPattern[];
    ingredientStock: IngredientStockPattern[];
    restaurantId: number;
    restaurant: RestaurantPattern;
  }
}
export {};
