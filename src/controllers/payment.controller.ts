import i18n from "i18n";
import { configure, makeAutoObservable } from "mobx";
// Networking
import axios, { APIS } from "networking";
import toast from "react-hot-toast";
// Services
import UploadService from "services/upload.service";
import IStore from "store/instant.store";

configure({ enforceActions: "never" });

class PaymentGroupPattern {
  groupId: string;
  totalPrice: number;
  paymentDate: Date;
  payments: PaymentPattern[];
  table: TablePattern;
}

class PaymentController {
  paymentGroups: PaymentGroupPattern[] = [];
  paymentGroup: Nullable<PaymentGroupPattern> = null;
  expenses: PaymentPattern[] = [];
  expense: Nullable<PaymentPattern> = null;
  expenseTypes: ExpenseTypePattern[] = [];
  expenseType: Nullable<ExpenseTypePattern> = null;
  constructor() {
    makeAutoObservable(this);
  }
  setPaymentGroup = (paymentGroup: Nullable<PaymentGroupPattern>) =>
    (this.paymentGroup = paymentGroup);
  setExpense = (expense: Nullable<PaymentPattern>) => (this.expense = expense);
  setExpenseType = (expenseType: Nullable<ExpenseTypePattern>) => (this.expenseType = expenseType);
  getGroups = async (dateRange: { startDate: Date; endDate: Date }) => {
    try {
      IStore.showLoader();
      let { data } = await axios.get(APIS.PAYMENT_GROUPS.rawValue, {
        params: { ...dateRange },
      });
      IStore.hideLoader();
      if (!data.error) this.paymentGroups = data.paymentGroups;
    } catch (err) {}
    return [];
  };
  getExpenses = async (dateRange: { startDate: Date; endDate: Date }) => {
    try {
      IStore.showLoader();
      let { data } = await axios.get(APIS.PAYMENT_EXPENSES.rawValue, {
        params: { ...dateRange },
      });
      IStore.hideLoader();
      if (!data.error) this.expenses = data.expenses;
    } catch (err) {}
    return [];
  };
  getExpenseTypes = async () => {
    try {
      IStore.showLoader();
      let { data } = await axios.get(APIS.PAYMENT_EXPENSE_TYPES.rawValue);
      IStore.hideLoader();
      if (!data.error) this.expenseTypes = <ExpenseTypePattern[]>data.expenseTypes;
    } catch (err) {}
    return [];
  };
  createExpense = async (expense: PaymentPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .put(APIS.PAYMENT_EXPENSES.rawValue, { ...expense })
        .finally(() => toast.success(i18n.t("success.CREATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  updateExpense = async (expense: PaymentPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .post(APIS.PAYMENT_EXPENSE.value(expense.id), { ...expense })
        .finally(() => toast.success(i18n.t("success.UPDATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  deleteExpense = async (expense: PaymentPattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .delete(APIS.PAYMENT_EXPENSE.value(expense.id))
        .finally(() => toast.success(i18n.t("success.DELETED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  createExpenseType = async (expenseType: ExpenseTypePattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .put(APIS.PAYMENT_EXPENSE_TYPES.rawValue, { ...expenseType })
        .finally(() => toast.success(i18n.t("success.CREATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  updateExpenseType = async (expenseType: ExpenseTypePattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .post(APIS.PAYMENT_EXPENSE_TYPE.value(expenseType.id), { ...expenseType })
        .finally(() => toast.success(i18n.t("success.UPDATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
  deleteExpenseType = async (expenseType: ExpenseTypePattern, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .delete(APIS.PAYMENT_EXPENSE_TYPE.value(expenseType.id))
        .finally(() => toast.success(i18n.t("success.DELETED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
}

export default PaymentController;
