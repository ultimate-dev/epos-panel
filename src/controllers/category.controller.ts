import i18n from "i18n";
import { configure, makeAutoObservable } from "mobx";
// Networking
import axios, { APIS } from "networking";
import toast from "react-hot-toast";
// Services
import UploadService from "services/upload.service";
// Store
import IStore from "store/instant.store";

configure({ enforceActions: "never" });

class CategoryController {
  categories: CategoryPattern[] = [];
  category: Nullable<CategoryPattern> = null;
  constructor() {
    makeAutoObservable(this);
  }
  setCategory = (category: Nullable<CategoryPattern>) => (this.category = category);

  get = async (type: CategoryPattern["type"]) => {
    try {
      IStore.showLoader();
      let { data } = await axios.get(APIS.CATEGORIES.rawValue, { params: { type } });
      IStore.hideLoader();
      if (!data.error) this.categories = <CategoryPattern[]>data.categories;
    } catch (err) {}
    return [];
  };

  create = async (category: CategoryPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      category["image"] = await UploadService(category["image"]);
      await axios
        .put(APIS.CATEGORIES.rawValue, { ...category })
        .finally(() => toast.success(i18n.t("success.CREATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  update = async (category: CategoryPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      category["image"] = await UploadService(category["image"]);
      await axios
        .post(APIS.CATEGORY.value(category.id), { ...category })
        .finally(() => toast.success(i18n.t("success.UPDATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  delete = async (category: CategoryPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .delete(APIS.CATEGORY.value(category.id))
        .finally(() => toast.success(i18n.t("success.DELETED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
}

export default CategoryController;
