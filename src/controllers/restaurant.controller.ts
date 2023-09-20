import i18n from "i18n";
import { configure, makeAutoObservable } from "mobx";
// Networking
import axios, { APIS } from "networking";
import toast from "react-hot-toast";
import UploadService from "services/upload.service";
import IStore from "store/instant.store";

configure({ enforceActions: "never" });

class RestaurantController {
  restaurants: RestaurantPattern[] = [];
  restaurant: Nullable<RestaurantPattern> = null;

  constructor() {
    makeAutoObservable(this);
  }
  get = async () => {
    try {
      let { data } = await axios.get(APIS.RESTAURANTS.rawValue);
      if (!data.error) this.restaurants = <RestaurantPattern[]>data.restaurants;
    } catch (err) {}
  };
  getOne = async (id: number) => {
    try {
      let { data } = await axios.get(APIS.RESTAURANT.value(id));
      if (!data.error) this.restaurant = <RestaurantPattern>data.restaurant;
    } catch (err) {}
  };
  update = async (restaurant: RestaurantPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      restaurant["logo"] = await UploadService(restaurant["logo"]);
      restaurant["banner"] = await UploadService(restaurant["banner"]);
      await axios
        .post(APIS.RESTAURANT.value(restaurant.id), { ...restaurant })
        .finally(() => toast.success(i18n.t("success.UPDATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
}

export default RestaurantController;
