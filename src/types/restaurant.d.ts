declare global {
  class RestaurantPattern {
    id: number;
    name: string;
    logo: string;
    banner: string;
    locale: LocaleCodesType;
    status: StatusType;
    createdAt: Date;
    updatedAt: Date;

    users: UserPattern[];
    categories: CategoryPattern[];
    products: ProductPattern[];
    tables: TablePattern[];
    orders: OrderPattern[];
    translations: TranslationPattern[];
    supplierId: number;
    supplier: SupplierPattern;
  }
}
export {};
