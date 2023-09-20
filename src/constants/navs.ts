import i18n from "i18n";
import { UserRole } from "./statuses";

const NAVS: any[] = [
  {
    icon: "dashboard-fill",
    to: "/",
    name: i18n.t("routes.dashboard"),
  },
  {
    section: i18n.t("sections.definitions"),
  },
  {
    icon: "stack-fill",
    to: "/products",
    name: i18n.t("routes.products"),
  },
  {
    icon: "layout-4-fill",
    to: "/tables",
    name: i18n.t("routes.tables"),
  },
  {
    icon: "checkbox-multiple-blank-fill",
    to: "/modifiers",
    name: i18n.t("routes.modifiers"),
  },
  {
    icon: "file-list-3-fill",
    to: "/ingredients",
    name: i18n.t("routes.ingredient_prescription"),
  },
  {
    icon: "translate",
    to: "/translations",
    name: i18n.t("routes.translations"),
  },
  {
    section: "Yönetim",
  },
  {
    icon: "shopping-basket-fill",
    to: "/orders",
    name: i18n.t("routes.orders"),
  },
  {
    icon: "arrow-left-right-fill",
    to: "/payments",
    name: i18n.t("routes.payments"),
  },
  {
    icon: "money-dollar-box-fill",
    to: "/case",
    name: i18n.t("routes.case"),
  },
  {
    icon: "layout-grid-fill",
    to: "/stock",
    name: i18n.t("routes.stock"),
  },
  {
    section: i18n.t("sections.analysis"),
  },
  {
    icon: "bar-chart-2-fill",
    to: "/statistics",
    name: i18n.t("routes.statistics"),
    menu: [
      {
        to: "/orders",
        name: i18n.t("routes.statisticOrders"),
      },
      {
        to: "/sales",
        name: i18n.t("routes.statisticSales"),
      },
      {
        to: "/stock",
        name: i18n.t("routes.statisticStock"),
      },
    ],
  },
  {
    icon: "file-chart-fill",
    name: i18n.t("routes.reports"),
    to: "/reports",
    menu: [
      {
        to: "/orders",
        name: i18n.t("routes.reportOrders"),
      },
      {
        to: "/sales",
        name: i18n.t("routes.reportSales"),
      },
      {
        to: "/stock",
        name: i18n.t("routes.reportStock"),
      },
    ],
  },
  {
    section: i18n.t("sections.settings"),
  },
  {
    icon: "store-3-fill",
    to: "restaurants",
    name: i18n.t("routes.restaurants"),
    roles: [UserRole["SUPERADMIN"]],
  },
  {
    icon: "home-gear-fill",
    to: "restaurant",
    name: i18n.t("routes.restaurant"),
  },
  {
    section: i18n.t("sections.tools"),
  },
  {
    icon: "delete-bin-5-fill",
    to: "trash",
    name: i18n.t("routes.trash"),
  },
];

export default NAVS;
