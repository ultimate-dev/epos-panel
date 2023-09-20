declare global {
  export class SupplierPattern {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    status: StatusType;

    restaurants: RestaurantPattern[];
    users: UserPattern[];
  }
}
export {};
