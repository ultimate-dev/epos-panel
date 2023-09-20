declare global {
  class ModifierGroupPattern {
    id: number;
    name: string;
    required: boolean;
    multiple: boolean;
    min?: number;
    max?: number;
    status: StatusType;
    createdAt: Date;
    updatedAt: Date;

    productId: number;
    product: ProductPattern;
    modifierProducts: ModifierProductPattern[];
    modidierSelections: ModifierSelectPattern[];
    translations: TranslationPattern[];
  }

  class ModifierProductPattern {
    id: number;
    name: string;
    status: StatusType;
    price: number;
    createdAt: Date;
    updatedAt: Date;

    modifierGroupId: number;
    modifierGroup: ModifierGroupPattern;
    modidierSelections: ModifierSelectPattern[];
    translations: TranslationPattern[];
  }

  class ModifierSelectPattern {
    id: number;
    status: StatusType;
    createdAt: Date;
    updatedAt: Date;
    orderProductId: number;
    orderProduct: OrderProductPattern;

    modifierGroupId: number;
    modifierGroup: ModifierGroupPattern;
    modifierProductId: number;
    modifierProduct: ModifierProductPattern;
  }
}

export {};
