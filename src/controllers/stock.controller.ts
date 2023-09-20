import i18n from "i18n";
import { configure, makeAutoObservable } from "mobx";
// Networking
import axios, { APIS } from "networking";
import toast from "react-hot-toast";
import IStore from "store/instant.store";

configure({ enforceActions: "never" });

class StockController {
  stockGroups: StockPattern[] = [];
  stocks: StockPattern[] = [];
  stock: Nullable<StockPattern> = null;
  stockCodes: StockCodePattern[] = [];
  stockCode: Nullable<StockCodePattern> = null;

  constructor() {
    makeAutoObservable(this);
  }
  setStock = (stock: Nullable<StockPattern>) => (this.stock = stock);
  setStockCode = (stockCode: Nullable<StockCodePattern>) => (this.stockCode = stockCode);

  getGroups = async () => {
    try {
      let { data } = await axios.get(APIS.STOCK_GROUPS.rawValue);
      if (!data.error) this.stockGroups = <StockPattern[]>data.stockGroups;
    } catch (err) {}
  };

  get = async (dateRange: { startDate: Date; endDate: Date }) => {
    try {
      let { data } = await axios.get(APIS.STOCKS.rawValue, { params: { ...dateRange } });
      if (!data.error) this.stocks = <StockPattern[]>data.stocks;
    } catch (err) {}
  };

  create = async (stock: StockPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .put(APIS.STOCKS.rawValue, { ...stock })
        .finally(() => toast.success(i18n.t("success.CREATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  update = async (stock: StockPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .post(APIS.STOCK.value(stock.id), { ...stock })
        .finally(() => toast.success(i18n.t("success.UPDATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  delete = async (stock: StockPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .delete(APIS.STOCK.value(stock.id))
        .finally(() => toast.success(i18n.t("success.DELETED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  getStockCodes = async () => {
    try {
      let { data } = await axios.get(APIS.STOCK_CODES.rawValue);
      if (!data.error) this.stockCodes = <StockCodePattern[]>data.stockCodes;
    } catch (err) {}
  };
  createStockCode = async (stockCode: StockCodePattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .put(APIS.STOCK_CODES.rawValue, { ...stockCode })
        .finally(() => toast.success(i18n.t("success.CREATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  updateStockCode = async (stockCode: StockCodePattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .post(APIS.STOCK_CODE.value(stockCode.id), { ...stockCode })
        .finally(() => toast.success(i18n.t("success.UPDATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  deleteStockCode = async (stockCode: StockCodePattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .delete(APIS.STOCK_CODE.value(stockCode.id))
        .finally(() => toast.success(i18n.t("success.DELETED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
}

export default StockController;
