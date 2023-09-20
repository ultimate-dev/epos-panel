declare global {
  class TablePattern {
    id: number;
    tableNum: number;
    status: StatusType;
    createdAt: Date;
    updatedAt: Date;

    restaurantId: number;
    restourant: RestaurantPattern;
    categoryId: number;
    category: CategoryPattern;
    orders: OrderPattern[];
  }
}
export {};
