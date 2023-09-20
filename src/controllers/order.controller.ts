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
class OrderGroupPattern {
  groupId: string;
  totalPrice: number;
  updatedAt: Date;
  orders: OrderPattern[];
  table: TablePattern;
  completed: boolean;
}
class OrderController {
  orderGroups: OrderGroupPattern[] = [];
  orderGroup: Nullable<OrderGroupPattern> = null;
  constructor() {
    makeAutoObservable(this);
  }
  setOrderGroup = (orderGroup: Nullable<OrderGroupPattern>) => (this.orderGroup = orderGroup);

  getGroups = async (dateRange: { startDate: Date; endDate: Date }) => {
    try {
      IStore.showLoader();
      let { data } = await axios.get(APIS.ORDER_GROUPS.rawValue, { params: { ...dateRange } });
      IStore.hideLoader();
      if (!data.error) this.orderGroups = <OrderGroupPattern[]>data.orderGroups;
    } catch (err) {}
    return [];
  };
  updateGroup = async (orderGroup: OrderGroupPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .post(APIS.ORDER_GROUP.value(orderGroup.groupId), { ...orderGroup })
        .finally(() => toast.success(i18n.t("success.UPDATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
}

export default OrderController;
