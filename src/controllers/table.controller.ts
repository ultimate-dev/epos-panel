import i18n from "i18n";
import { configure, makeAutoObservable } from "mobx";
// Networking
import axios, { APIS } from "networking";
import toast from "react-hot-toast";
// Services
import UploadService from "services/upload.service";
import IStore from "store/instant.store";

configure({ enforceActions: "never" });

class TableController {
  tables: TablePattern[] = [];
  table: Nullable<TablePattern> = null;
  constructor() {
    makeAutoObservable(this);
  }
  setTable = (table: Nullable<TablePattern>) => (this.table = table);
  get = async () => {
    try {
      IStore.showLoader();
      let { data } = await axios.get(APIS.TABLES.rawValue);
      IStore.hideLoader();
      if (!data.error) this.tables = <TablePattern[]>data.tables;
    } catch (err) {}
    return [];
  };
  create = async (table: TablePattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .put(APIS.TABLES.rawValue, { ...table })
        .finally(() => toast.success(i18n.t("success.CREATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  update = async (table: TablePattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .post(APIS.TABLE.value(table.id), { ...table })
        .finally(() => toast.success(i18n.t("success.UPDATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  delete = async (table: TablePattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .delete(APIS.TABLE.value(table.id))
        .finally(() => toast.success(i18n.t("success.DELETED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
}

export default TableController;
