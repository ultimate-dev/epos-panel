class PaymentGroupPattern {
  groupId: string;
  totalPrice: number;
  paymentDate: Date;
  payments: PaymentPattern[];
  table: TablePattern;
}

class OrderGroupPattern {
  groupId: string;
  totalPrice: number;
  updatedAt: Date;
  orders: OrderPattern[];
  table: TablePattern;
  completed: boolean;
}

export const getPays = (orderGroups: OrderGroupPattern[], paymentGroups: PaymentGroupPattern[]) => {
  let pays: any = {};
  pays = orderGroups.reduce(
    (sum, { groupId, orders }) => ({ ...sum, [groupId]: { ...pays[groupId], orders } }),
    {}
  );
  pays = paymentGroups.reduce(
    (sum, { groupId, payments }) => ({ ...sum, [groupId]: { ...pays[groupId], payments } }),
    {}
  );
  return pays;
};

type CaseStatus = PaymentType | OrderStatusType;
export const calcCase = (
  pays: { orders: OrderPattern[]; payments: PaymentPattern[] }[],
  arr?: CaseStatus[]
) => {
  return Object.values(pays).reduce(
    (sum, pay) =>
      sum +
      pay.orders
        .filter((order) => (arr ? arr.includes(order.status) : true))
        .reduce((s, order) => s + order.totalPrice, 0) +
      pay.payments
        .filter((payment) => (arr ? arr.includes(payment.type) : true))
        .reduce((s, payment) => s + payment.totalPrice, 0),
    0
  );
};
export const calcPercent = (value: number, total: number) => {
  return (value * 100) / total || 0;
};
