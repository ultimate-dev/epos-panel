import { configure, makeAutoObservable, toJS } from "mobx";
import axios, { APIS } from "networking";

configure({ enforceActions: "never" });

class TrashController {
  trash = [];
  constructor() {
    makeAutoObservable(this);
  }
  get = async (dateRange: { startDate: Date; endDate: Date }) => {
    try {
      let { data } = await axios.get(APIS.TRASH.rawValue, { params: dateRange });
      if (!data.error) this.trash = data.trash;
    } catch (err) {}
    return [];
  };
}

export default TrashController;
