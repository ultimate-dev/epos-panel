import i18n from "i18n";
import { configure, makeAutoObservable } from "mobx";
// Networking
import axios, { APIS } from "networking";
import toast from "react-hot-toast";
// Services
import UploadService from "services/upload.service";
import IStore from "store/instant.store";

configure({ enforceActions: "never" });

class ProductController {
  products: ProductPattern[] = [];
  product: Nullable<ProductPattern> = null;
  constructor() {
    makeAutoObservable(this);
  }
  setProduct = (product: Nullable<ProductPattern>) => (this.product = product);
  get = async () => {
    try {
      IStore.showLoader();
      let { data } = await axios.get(APIS.PRODUCTS.rawValue);
      IStore.hideLoader();
      if (!data.error) this.products = <ProductPattern[]>data.products;
    } catch (err) {}
    return [];
  };
  create = async (product: ProductPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      product["image"] = await UploadService(product["image"]);
      await axios
        .put(APIS.PRODUCTS.rawValue, { ...product })
        .finally(() => toast.success(i18n.t("success.CREATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  update = async (product: ProductPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      product["image"] = await UploadService(product["image"]);
      await axios
        .post(APIS.PRODUCT.value(product.id), { ...product })
        .finally(() => toast.success(i18n.t("success.UPDATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  delete = async (product: ProductPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .delete(APIS.PRODUCT.value(product.id))
        .finally(() => toast.success(i18n.t("success.DELETED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
}

export default ProductController;
