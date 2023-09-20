import { configure, makeAutoObservable, toJS } from "mobx";
import axios, { APIS } from "networking";

configure({ enforceActions: "never" });

class PayType {
  price: number;
  count: number;
}

const INITIAL_TOTAL = { price: 0, count: 0 };
class CaseController {
  case: {
    total: PayType;
    cashTotal: PayType;
    creditTotal: PayType;
    createdTotal: PayType;
    discountTotal: PayType;
    changeTotal: PayType;
    completedTotal: PayType;
    cancelledTotal: PayType;
    returnedTotal: PayType;
    expenseTotal: PayType;
    cashExpenseTotal: PayType;
    creditExpenseTotal: PayType;
  } = {
    total: INITIAL_TOTAL,
    cashTotal: INITIAL_TOTAL,
    creditTotal: INITIAL_TOTAL,
    createdTotal: INITIAL_TOTAL,
    discountTotal: INITIAL_TOTAL,
    changeTotal: INITIAL_TOTAL,
    completedTotal: INITIAL_TOTAL,
    cancelledTotal: INITIAL_TOTAL,
    returnedTotal: INITIAL_TOTAL,
    expenseTotal: INITIAL_TOTAL,
    cashExpenseTotal: INITIAL_TOTAL,
    creditExpenseTotal: INITIAL_TOTAL,
  };
  chart: {
    expenseTypes: ExpenseTypePattern[];
    payments: PaymentPattern[];
  } = { expenseTypes: [], payments: [] };
  constructor() {
    makeAutoObservable(this);
  }
  get = async (dateRange: { startDate: Date; endDate: Date }) => {
    try {
      let { data } = await axios.get(APIS.CASE.rawValue, { params: dateRange });
      if (!data.error) {
        this.case = data.case;
        this.chart = data.chart;
      }
    } catch (err) {}
    return [];
  };
}

export default CaseController;
