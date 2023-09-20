declare global {
  class TranslationPattern {
    id: number;
    code: LocaleCodesType;
    area: string;
    translate: string;
    createdAt: Date;
    updatedAt: Date;

    productId?: number;
    product?: ProductPattern;
    categoryId?: number;
    category?: CategoryPattern;
    modifierGroupId?: number;
    modifierGroup?: ModifierGroupPattern;
    modifierProductId?: number;
    modifierProduct?: ModifierProductPattern;
    restaurantId: number;
    restourant: RestaurantPattern;
  }
}
export {};
