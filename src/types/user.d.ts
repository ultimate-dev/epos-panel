declare global {
  class UserPattern {
    id: number;
    name: string;
    surname: string;
    email: string;
    letters: string;
    password: string;
    gender: GenderType;
    role: UserRoleType;
    status: StatusType;
    createdAt: Date;
    updatedAt: Date;

    restaurantId?: number;
    restaurant?: RestaurantPattern;
    supplierId: number;
    supplier: SupplierPattern;
  }

  type UserRoleType = "SUPERADMIN" | "ADMIN" | "USER";
  type GenderType = "MALE" | "FEMALE" | "UNSPECIFIED";
}
export {};
