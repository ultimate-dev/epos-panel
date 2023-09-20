declare global {
  class PaymentPattern {
    id: string;
    groupId: string;
    type: PaymentType;
    totalPrice: number;
    status: StatusType;

    paymentDate: Date;
    createdAt: Date;
    updatedAt: Date;

    tableId: number;
    table: TablePattern;
    expenseTypeId?: number;
    expenseType?: ExpenseTypePattern;
    restaurantId: number;
    restourant: RestaurantPattern;
    paymentItems: PaymentItemPattern[];
  }

  class PaymentItemPattern {
    id: number;
    status: StatusType;
    price: number;
    paymentId: string;
    payment: PaymentPattern;
    orderProducts: OrderProductPattern[];

    createdAt: Date;
    updatedAt: Date;
  }

  class ExpenseTypePattern {
    id: number;
    name: string;
    status: StatusType;

    createdAt: Date;
    updatedAt: Date;

    restaurantId: number;
    restourant: RestaurantPattern;
    payments: PaymentPattern[];
  }

  type PaymentType = "CASH" | "CREDIT" | "CHANGE" | "DISCOUNT" | "RETURNED" | "CANCELLED";
}
export {};
