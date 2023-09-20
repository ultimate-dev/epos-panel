declare global {
  class OrderPattern {
    id: number;
    groupId: string;
    completed: boolean;
    note: string;
    status: OrderStatusType;
    totalPrice: number;
    data: OrderPattern;
    orderDate: Date;
    createdAt: Date;
    updatedAt: Date;

    orderProducts: OrderProductPattern[];
    tableId: number;
    table: TablePattern;
    restaurantId: number;
    restourant: RestaurantPattern;
  }

  class OrderProductPattern {
    id: number;
    count: number;
    uuid: string;
    status: OrderProductStatusType;
    createdAt: Date;
    updatedAt: Date;
    orderId: number;
    order: OrderPattern;
    productId: number;
    product: ProductPattern;
    paymentItemId?: number;
    paymentItem?: PaymentItemPattern;
    modifierSelections: ModifierSelectPattern[];
  }

  type OrderStatusType =
    | "CREATED"
    | "PREPARING"
    | "READY"
    | "PAID"
    | "ONTHEWAY"
    | "COMPLATED"
    | "CANCELLED"
    | "RETURNED";

  type OrderProductStatusType = "WAITING" | "APPROVED";
}

export {};
