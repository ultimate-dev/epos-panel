import i18n from "i18n";
import { configure, makeAutoObservable } from "mobx";
// Networking
import axios, { APIS } from "networking";
import toast from "react-hot-toast";
import IStore from "store/instant.store";

configure({ enforceActions: "never" });

class IngredientController {
  ingredients: IngredientPattern[] = [];
  ingredient: Nullable<IngredientPattern> = null;
  ingredientStocks: IngredientStockPattern[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setIngredient = (ingredient: Nullable<IngredientPattern>) => (this.ingredient = ingredient);

  get = async () => {
    try {
      let { data } = await axios.get(APIS.INGREDIENTS.rawValue);
      if (!data.error) this.ingredients = <IngredientPattern[]>data.ingredients;
    } catch (err) {}
  };
  create = async (ingredient: IngredientPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .put(APIS.INGREDIENTS.rawValue, { ...ingredient })
        .finally(() => toast.success(i18n.t("success.CREATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  update = async (ingredient: IngredientPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .post(APIS.INGREDIENT.value(ingredient.id), { ...ingredient })
        .finally(() => toast.success(i18n.t("success.UPDATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  delete = async (ingredient: IngredientPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .delete(APIS.INGREDIENT.value(ingredient.id))
        .finally(() => toast.success(i18n.t("success.DELETED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };

  getStocks = async () => {
    try {
      let { data } = await axios.get(APIS.INGREDIENT_STOCKS.rawValue);
      if (!data.error) this.ingredientStocks = <IngredientStockPattern[]>data.ingredientStocks;
      console.log(data.ingredientStocks);
    } catch (err) {}
  };

  createStock = async (values: any, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .put(APIS.INGREDIENT_STOCKS.rawValue, { ...values })
        .finally(() => toast.success(i18n.t("success.CREATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  updateStock = async (values: any, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .post(APIS.INGREDIENT_STOCK.value(values.id), { ...values })
        .finally(() => toast.success(i18n.t("success.UPDATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  deleteStock = async (values: any, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .delete(APIS.INGREDIENT_STOCK.value(values.id))
        .finally(() => toast.success(i18n.t("success.DELETED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
}

export default IngredientController;
