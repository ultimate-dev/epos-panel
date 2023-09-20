class API {
  rawValue: string;

  constructor(str: string) {
    this.rawValue = str;
  }

  value(...args: any[]) {
    let val = this.rawValue;
    let match,
      i = 0;
    do {
      match = /(\$\d+)/gu.exec(val);
      if (match && args[i]) val = val.replace(match[0], args[i++]);
    } while (match);
    return val;
  }
}

const apis = {
  AUTH_LOGIN: new API("/auth/login?admin=true"),
  AUTH_VERIFY: new API("/auth/verify?admin=true"),
  UPLOAD: new API("/panel/upload"),
  ACCOUNT: new API("/panel/account"),
  ACCOUNT_EMAIL: new API("/panel/account/email"),
  ACCOUNT_PASSWORD: new API("/panel/account/password"),
  RESTAURANTS: new API("/panel/restaurant"),
  RESTAURANT: new API("/panel/restaurant/$1"),
  PRODUCTS: new API("/panel/product"),
  PRODUCT: new API("/panel/product/$1"),
  TABLES: new API("/panel/table"),
  TABLE: new API("/panel/table/$1"),
  CATEGORIES: new API("/panel/category"),
  CATEGORY: new API("/panel/category/$1"),
  CATEGORY_PRODUCTS: new API("/panel/category/product"),
  CATEGORY_TABLES: new API("/panel/category/table"),
  MODIFIERS: new API("/panel/modifier"),
  MODIFIER: new API("/panel/modifier/$1"),
  MODIFIER_PRODUCTS: new API("/panel/modifier/product"),
  MODIFIER_PRODUCT: new API("/panel/modifier/product/$1"),
  INGREDIENTS: new API("/panel/ingredient"),
  INGREDIENT: new API("/panel/ingredient/$1"),
  INGREDIENT_STOCKS: new API("/panel/ingredient/stock"),
  INGREDIENT_STOCK: new API("/panel/ingredient/stock/$1"),
  TRANSLATIONS: new API("/panel/translation"),
  TRANSLATION: new API("/panel/translation/$1/$2/$3"),
  TRANSLATION_TRANSLATE: new API("/panel/translation/translate"),
  ORDER_GROUPS: new API("/panel/order/group"),
  ORDER_GROUP: new API("/panel/order/group/$1"),
  PAYMENT_GROUPS: new API("/panel/payment/group"),
  PAYMENT_EXPENSE_TYPES: new API("/panel/payment/expense/type"),
  PAYMENT_EXPENSE_TYPE: new API("/panel/payment/expense/type/$1"),
  PAYMENT_EXPENSES: new API("/panel/payment/expense"),
  PAYMENT_EXPENSE: new API("/panel/payment/expense/$1"),
  CASE: new API("/panel/case"),
  STOCKS: new API("/panel/stock"),
  STOCK: new API("/panel/stock/$1"),
  STOCK_GROUPS: new API("/panel/stock/group"),
  STOCK_CODES: new API("/panel/stock/code"),
  STOCK_CODE: new API("/panel/stock/code/$1"),
  TRASH: new API("/panel/trash"),
};

export default apis;
