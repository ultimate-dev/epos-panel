import i18n from "i18n";
import { UserRole } from "./statuses";
// Layouts
import AuthLayout from "layouts/auth.layout";
import DefaultLayout from "layouts/default.layout";
// Pages
import ErrorPage from "pages/error.page";
import LoginPage from "pages/Auth/login.page";
import RegisterPage from "pages/Auth/register.page";
import ForgotPasswordPage from "pages/Auth/forgotPassword.page";
import AccountPage from "pages/account.page";

import DashboardPage from "pages/dashboard.page";

import TablesPage from "pages/tables.page";
import ProductsPage from "pages/products.page";
import TranslationsPage from "pages/translations.page";
import ModifiersPage from "pages/modifiers.page";
import IngredientsPage from "pages/ingredients.page";

import OrdersPage from "pages/orders.page";
import PaymentsPage from "pages/payments.page";
import CasePage from "pages/case.page";

import StockPage from "pages/stock.page";

import StatisticOrdersPage from "pages/statistic.orders.page";
import StatisticSalesPage from "pages/statistic.sales.page";
import StatisticStockPage from "pages/statistic.stock.page";

import ReportOrdersPage from "pages/report.orders.page";
import ReportSalesPage from "pages/report.sales.page";
import ReportStockPage from "pages/report.stock.page";

import RestaurantPage from "pages/restaurant.page";
import RestaurantsPage from "pages/restaurants.page";

import TrashPage from 'pages/trash.page'


const ROUTES: any[] = [
  {
    path: "/auth",
    element: AuthLayout,
    props: {},
    outlets: [
      {
        path: "/login",
        element: LoginPage,
        props: {},
      },
      {
        path: "/register",
        element: RegisterPage,
        props: {},
      },
      {
        path: "/forgot-password",
        element: ForgotPasswordPage,
        props: {},
      },
    ],
  },
  {
    path: "",
    element: DefaultLayout,
    props: {},
    outlets: [
      {
        path: "/",
        element: DashboardPage,
        props: {},
        roles: [],
      },
      {
        path: "/account",
        element: AccountPage,
        props: {},
        roles: [],
      },
      //
      {
        path: "/products",
        element: ProductsPage,
        props: {},
        roles: [],
      },
      {
        path: "/tables",
        element: TablesPage,
        props: {},
        roles: [],
      },
      {
        path: "/translations",
        element: TranslationsPage,
        props: {},
        roles: [],
      },
      {
        path: "/modifiers",
        element: ModifiersPage,
        props: {},
        roles: [],
      },
      {
        path: "/ingredients",
        element: IngredientsPage,
        props: {},
        roles: [],
      },
      //
      {
        path: "/orders",
        element: OrdersPage,
        props: {},
        roles: [],
      },
      {
        path: "/payments",
        element: PaymentsPage,
        props: {},
        roles: [],
      },
      {
        path: "/stock",
        element: StockPage,
        props: {},
        roles: [],
      },
      {
        path: "/case",
        element: CasePage,
        props: {},
        roles: [],
      },
      //
      {
        path: "/statistics/orders",
        element: StatisticOrdersPage,
        props: {},
        roles: [],
      },
      {
        path: "/statistics/sales",
        element: StatisticSalesPage,
        props: {},
        roles: [],
      },
      {
        path: "/statistics/stock",
        element: StatisticStockPage,
        props: {},
        roles: [],
      },
      //
      {
        path: "/reports/orders",
        element: ReportOrdersPage,
        props: {},
        roles: [],
      },
      {
        path: "/reports/sales",
        element: ReportSalesPage,
        props: {},
        roles: [],
      },
      {
        path: "/reports/stock",
        element: ReportStockPage,
        props: {},
        roles: [],
      },
      //
      {
        path: "/restaurant",
        element: RestaurantPage,
        props: {},
        roles: [],
      },
      {
        path: "/restaurants",
        element: RestaurantsPage,
        props: {},
        roles: [UserRole["SUPERADMIN"]],
      },
      //
      {
        path: "/trash",
        element: TrashPage,
        props: {},
        roles: [],
      },
    ],
  },
  {
    path: "/*",
    element: ErrorPage,
    props: { code: 404, text: i18n.t("error.404") },
  },
];

export default ROUTES;
