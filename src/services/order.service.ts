export const calcTotalPrice = (orderProducts: OrderProductPattern[]) => {
  try {
    let totalPrice = 0;
    orderProducts.forEach((orderProduct) => {
      totalPrice += orderProduct.count * orderProduct.product.sellingPrice;
      totalPrice +=
        orderProduct.count *
        calcTotalModifierSelect(
          orderProduct.modifierSelections,
          orderProduct.product.modifierGroups
        );
    });
    return <number>totalPrice;
  } catch (err) {}
  return 0;
};

export const calcTotalModifierSelect = (
  modifierSelections: ModifierSelectPattern[],
  modifierGroups: ModifierGroupPattern[]
) => {
  try {
    let totalPrice = 0;
    modifierSelections.forEach((modifierSelect) => {
      let modifierProduct = modifierGroups
        .find((modifierGroup) => modifierSelect.modifierGroupId == modifierGroup.id)
        ?.modifierProducts.find(
          (modifierProduct) => modifierSelect.modifierProductId == modifierProduct.id
        );
      totalPrice += modifierProduct ? modifierProduct.price : 0;
    });
    return totalPrice;
  } catch (err) {}
  return 0;
};
