import i18n from "i18n";
import { configure, makeAutoObservable } from "mobx";
// Networking
import axios, { APIS } from "networking";
import toast from "react-hot-toast";
import IStore from "store/instant.store";

configure({ enforceActions: "never" });

class ModifierController {
  modifiers: ModifierGroupPattern[] = [];
  constructor() {
    makeAutoObservable(this);
  }
  get = async () => {
    try {
      let { data } = await axios.get(APIS.MODIFIERS.rawValue);
      if (!data.error) this.modifiers = <ModifierGroupPattern[]>data.modifiers;
    } catch (err) {}
  };

  create = async (modifier: ModifierGroupPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .put(APIS.MODIFIERS.rawValue, { ...modifier })
        .finally(() => toast.success(i18n.t("success.CREATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  update = async (modifier: ModifierGroupPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .post(APIS.MODIFIER.value(modifier.id), { ...modifier })
        .finally(() => toast.success(i18n.t("success.UPDATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  delete = async (modifier: ModifierGroupPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .delete(APIS.MODIFIER.value(modifier.id))
        .finally(() => toast.success(i18n.t("success.DELETED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };

  createProduct = async (modifierProduct: ModifierProductPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .put(APIS.MODIFIER_PRODUCTS.rawValue, { ...modifierProduct })
        .finally(() => toast.success(i18n.t("success.CREATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  updateProduct = async (modifierProduct: ModifierProductPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .post(APIS.MODIFIER_PRODUCT.value(modifierProduct.id), { ...modifierProduct })
        .finally(() => toast.success(i18n.t("success.UPDATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  deleteProduct = async (modifierProduct: ModifierProductPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .delete(APIS.MODIFIER_PRODUCT.value(modifierProduct.id))
        .finally(() => toast.success(i18n.t("success.DELETED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
}

export default ModifierController;
