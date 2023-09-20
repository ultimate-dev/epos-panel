import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Col, Row } from "reactstrap";
import { DatePicker, Drawer, Select, Tabs } from "antd";
import _ from "lodash";
import i18n from "i18n";
// Components
import DataTable from "components/common/DataTable";
import Breadcrumb from "components/common/Breadcrumb";
import DataForm, { controlForm } from "components/common/DataForm";
// Controllers
// Constants
import { QuantityType, Status } from "constants/statuses";
import { RULES } from "constants/forms";
import { StatusColor } from "constants/colors";
import StockController from "controllers/stock.controller";
import IngredientController from "controllers/ingredient.controller";
import moment from "moment";
import { Sparklines, SparklinesBars, SparklinesCurve, SparklinesLine } from "react-sparklines";
import { CHART_COLORS } from "components/common/Chart";
import { toJS } from "mobx";

const STOCK_GROUP_COLUMNS: any[] = [
  {
    key: "stockCode.name",
    title: "Stok Kodu",
    type: "text",
  },
  {
    key: "quantity",
    title: "Stok Miktarı",
    type: "number",
    width: 200,
    render: (quantity: number) =>
      quantity >= 0 ? (
        <span className="fw-bold text-primary">+{Number(quantity).toFixed(2)}</span>
      ) : (
        <span className="fw-bold text-danger">{Number(quantity).toFixed(2)}</span>
      ),
  },
  {
    key: "ingredient.quantityType",
    title: "Stok Birimi",
    type: "tag",
    tags: Object.values(QuantityType).map((type: any) => ({
      label: i18n.t("quantityType." + type),
      value: type,
      color: "default",
    })),
  },
  {
    key: "ingredient.name",
    title: "Hammade",
    type: "text",
  },
  {
    key: "ingredient.barcode",
    title: "Hammade Barkodu",
    type: "text",
  },
  {
    key: "status",
    title: "Durum",
    type: "tag",
    tags: Object.values(Status).map((status: any) => ({
      label: i18n.t("status." + status),
      value: status,
      color: StatusColor[status],
    })),
  },
  {
    key: "stocks",
    title: "",
    type: "custom",
    width: 160,
    render: (stocks: StockPattern[], record: StockPattern) => (
      <Sparklines
        data={stocks.map((stock, index) =>
          stocks.slice(index, stocks.length + 1).reduce((sum, item) => sum + item.quantity, 0)
        )}
        svgWidth={140}
        svgHeight={32}
      >
        <SparklinesCurve
          style={{
            strokeWidth: 5,
            stroke: record.quantity >= 0 ? CHART_COLORS[1] : CHART_COLORS[0],
            fill: record.quantity >= 0 ? CHART_COLORS[1] : CHART_COLORS[0],
          }}
        />
      </Sparklines>
    ),
  },
];
const STOCK_COLUMNS: any[] = [
  {
    key: "stockCode.name",
    title: "Stok Kodu",
    type: "text",
  },
  {
    key: "quantity",
    title: "Stok Miktarı",
    type: "number",
    render: (quantity: number) =>
      quantity >= 0 ? (
        <span className="fw-bold text-primary">+{Number(quantity).toFixed(2)}</span>
      ) : (
        <span className="fw-bold text-danger">{Number(quantity).toFixed(2)}</span>
      ),
  },
  {
    key: "ingredient.quantityType",
    title: "Stok Birimi",
    type: "tag",
    tags: Object.values(QuantityType).map((type: any) => ({
      label: i18n.t("quantityType." + type),
      value: type,
      color: "default",
    })),
  },
  {
    key: "ingredient.name",
    title: "Hammade",
    type: "custom",
    render: (value: any, record: any) => (
      <>
        <div>{record.ingredient.name}</div>
        {record.orderProduct && (
          <div style={{ marginTop: -6 }}>
            <small className="text-muted">
              {record.orderProduct.count + "x"}
              {record.ingredientStock?.product && "(" + record.ingredientStock.product?.name + ")"}
              {record.ingredientStock?.modifierProduct &&
                "(" +
                  record.ingredientStock.modifierProduct?.modifierGroup.name +
                  ": " +
                  record.ingredientStock.modifierProduct?.name +
                  ")"}
            </small>
          </div>
        )}
      </>
    ),
  },
  {
    key: "ingredient.barcode",
    title: "Hammade Barkodu",
    type: "text",
  },
  {
    key: "status",
    title: "Durum",
    type: "tag",
    tags: Object.values(Status).map((status: any) => ({
      label: i18n.t("status." + status),
      value: status,
      color: StatusColor[status],
    })),
  },
  {
    key: "createdAt",
    title: "Stok Giriş Tarihi",
    type: "date",
  },
  {
    key: "total",
    title: "Toplam",
    render: (quantity: number) =>
      quantity >= 0 ? (
        <span className="fw-bold text-primary">+{Number(quantity).toFixed(2)}</span>
      ) : (
        <span className="fw-bold text-danger">{Number(quantity).toFixed(2)}</span>
      ),
  },
];
const STOCK_FORM: any[] = [
  {
    label: "Durum",
    key: "status",
    type: "switch",
    transform: [
      { from: false, to: Status["PASSIVE"] },
      { from: true, to: Status["ACTIVE"] },
    ],
    props: {
      unCheckedChildren: "Pasif",
      checkedChildren: "Aktif",
    },
  },
  {
    label: "Stok Kodu",
    key: "stockCodeId",
    type: "select",
    include: "stockCodes",
    rules: [RULES["REQUIRED"]],
  },
  {
    span: 6,
    key: "stockCodeId",
    type: "button",
    props: {
      children: "Güncelle",
      color: "secondary",
    },
    include: "onEditStockCode",
  },
  {
    span: 6,
    key: "stockCodeId",
    type: "button",
    props: {
      children: "Yeni",
      color: "primary",
    },
    include: "onNewStockCode",
  },
  {
    label: "Stok Miktarı",
    key: "quantity",
    type: "number",
    rules: [RULES["REQUIRED"]],
  },
  {
    label: "Hammade",
    key: "ingredientId",
    type: "select",
    include: "ingredients",
  },
];
const STOCK_CODE_FORM: any[] = [
  {
    label: "Stok Kodu",
    key: "name",
    type: "text",
    rules: [RULES["REQUIRED"]],
  },
];

const STOCK_DEFAULT: any = {
  status: Status["ACTIVE"],
};
const STOCK_CODE_DEFAULT: any = {
  status: Status["ACTIVE"],
};

const StockPage = () => {
  let [stockC] = useState(new StockController());
  let [ingredientC] = useState(new IngredientController());
  let [dateRange, setDateRange]: any = useState({ startDate: new Date(), endDate: new Date() });
  let [ingredientId, setIngredientId]: any = useState(null);
  let [stockCodeId, setStockCodeId]: any = useState(null);

  useEffect(() => {
    stockC.get(dateRange);
    stockC.getGroups();
    stockC.getStockCodes();
    ingredientC.get();
  }, [dateRange]);

  return (
    <>
      <Breadcrumb title={i18n.t("routes.stock")} />
      <Row>
        <Col>
          <Tabs type="card">
            <Tabs.TabPane tab={i18n.t("routes.stockLists")} key="stockLists">
              <DataTable
                columns={STOCK_GROUP_COLUMNS}
                data={stockC.stockGroups.filter(
                  (stock) =>
                    (ingredientId ? stock.ingredientId == ingredientId : true) &&
                    (stockCodeId ? stock.stockCodeId == stockCodeId : true)
                )}
                buttons={[
                  <Select
                    style={{ width: 120 }}
                    placeholder="Stok Kodu"
                    options={[
                      ...stockC.stockCodes.map((stockCode) => ({
                        label: stockCode.name,
                        value: stockCode.id,
                      })),
                    ]}
                    value={stockCodeId}
                    onChange={(e) => setStockCodeId(e)}
                  />,
                  <Select
                    style={{ width: 140 }}
                    placeholder="Hammade"
                    options={[
                      ...ingredientC.ingredients.map((ingredient) => ({
                        label: ingredient.name,
                        value: ingredient.id,
                      })),
                    ]}
                    value={ingredientId}
                    onChange={(e) => setIngredientId(e)}
                  />,
                  {
                    text: "Stok Ekle",
                    color: "primary",
                    onClick: (initial) => stockC.setStock(initial),
                  },
                  {
                    text: "Yenile",
                    color: "secondary",
                    onClick: () => stockC.getGroups(),
                  },
                ]}
              />
            </Tabs.TabPane>

            <Tabs.TabPane tab={i18n.t("routes.stockTransactions")} key="stockTransactions">
              <DataTable
                columns={STOCK_COLUMNS}
                data={stockC.stocks.filter(
                  (stock) =>
                    (ingredientId ? stock.ingredientId == ingredientId : true) &&
                    (stockCodeId ? stock.stockCodeId == stockCodeId : true)
                )}
                actions={[
                  {
                    icon: "edit",
                    color: "primary",
                    onClick: (record) => stockC.setStock(record),
                  },
                ]}
                buttons={[
                  <Select
                    style={{ width: 120 }}
                    placeholder="Stok Kodu"
                    options={[
                      ...stockC.stockCodes.map((stockCode) => ({
                        label: stockCode.name,
                        value: stockCode.id,
                      })),
                    ]}
                    value={stockCodeId}
                    onChange={(e) => setStockCodeId(e)}
                  />,
                  <Select
                    style={{ width: 140 }}
                    placeholder="Hammade"
                    options={[
                      ...ingredientC.ingredients.map((ingredient) => ({
                        label: ingredient.name,
                        value: ingredient.id,
                      })),
                    ]}
                    value={ingredientId}
                    onChange={(e) => setIngredientId(e)}
                  />,
                  <DatePicker.RangePicker
                    value={[moment(dateRange.startDate), moment(dateRange.endDate)]}
                    onChange={(e: any) =>
                      setDateRange({ startDate: new Date(e[0]), endDate: new Date(e[1]) })
                    }
                    disabledDate={(date) => date >= moment(new Date())}
                  />,
                  {
                    text: "Stok Ekle",
                    color: "primary",
                    onClick: (initial) => stockC.setStock(initial),
                  },
                  {
                    text: "Yenile",
                    color: "secondary",
                    onClick: () => stockC.get(dateRange),
                  },
                ]}
              />
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>

      <Drawer
        title={!stockC.stock?.id ? "Stok Oluştur" : "Stok Bilgileri"}
        open={!_.isNull(stockC.stock)}
        onClose={() => stockC.setStock(null)}
      >
        <DataForm
          defaultValues={{ ...STOCK_DEFAULT, ...stockC.stock }}
          form={controlForm(STOCK_FORM, {
            onEditStockCode: (id: number) =>
              stockC.setStockCode(
                stockC.stockCodes.find((stockCode) => stockCode.id == id) || null
              ),
            onNewStockCode: (id: number, obj: any = {}) => stockC.setStockCode(obj),
            stockCodes: stockC.stockCodes.map((stockCode) => ({
              label: stockCode.name,
              value: stockCode.id,
            })),
            ingredients: ingredientC.ingredients.map((ingredient) => ({
              label: ingredient.name,
              value: ingredient.id,
            })),
          })}
          buttons={
            !stockC.stock?.id
              ? [
                  {
                    text: "İptal",
                    color: "secondary",
                    onClick: (values) => stockC.setStock(null),
                  },
                  {
                    text: "Oluştur",
                    color: "primary",
                    submit: true,
                    onClick: (values) =>
                      stockC.create(values, () => {
                        stockC.get(dateRange);
                        stockC.getGroups();
                        stockC.setStock(null);
                      }),
                  },
                ]
              : [
                  {
                    text: "Sil",
                    color: "danger",
                    onClick: (values) =>
                      stockC.delete(values, () => {
                        stockC.get(dateRange);
                        stockC.getGroups();
                        stockC.setStock(null);
                      }),
                  },
                  {
                    text: "İptal",
                    color: "secondary",
                    onClick: (values) => stockC.setStock(null),
                  },
                  {
                    text: "Kaydet",
                    color: "primary",
                    submit: true,
                    onClick: (values) =>
                      stockC.update(values, () => {
                        stockC.get(dateRange);
                        stockC.getGroups();
                        stockC.setStock(null);
                      }),
                  },
                ]
          }
        />
        <Drawer
          title={!stockC.stockCode?.id ? "Stok Kodu Oluştur" : "Stok Kodu Bilgileri"}
          open={!_.isNull(stockC.stockCode)}
          onClose={() => stockC.setStockCode(null)}
        >
          <DataForm
            defaultValues={{ ...STOCK_CODE_DEFAULT, ...stockC.stockCode }}
            form={controlForm(STOCK_CODE_FORM)}
            buttons={
              !stockC.stockCode?.id
                ? [
                    {
                      text: "İptal",
                      color: "secondary",
                      onClick: (values) => stockC.setStockCode(null),
                    },
                    {
                      text: "Oluştur",
                      color: "primary",
                      submit: true,
                      onClick: (values) =>
                        stockC.createStockCode(values, () => {
                          stockC.getStockCodes();
                          stockC.get(dateRange);
                          stockC.getGroups();
                          stockC.setStockCode(null);
                        }),
                    },
                  ]
                : [
                    {
                      text: "Sil",
                      color: "danger",
                      onClick: (values) =>
                        stockC.deleteStockCode(values, () => {
                          stockC.getStockCodes();
                          stockC.get(dateRange);
                          stockC.getGroups();
                          stockC.setStockCode(null);
                        }),
                    },
                    {
                      text: "İptal",
                      color: "secondary",
                      onClick: (values) => stockC.setStockCode(null),
                    },
                    {
                      text: "Kaydet",
                      color: "primary",
                      submit: true,
                      onClick: (values) =>
                        stockC.updateStockCode(values, () => {
                          stockC.getStockCodes();
                          stockC.get(dateRange);
                          stockC.getGroups();
                          stockC.setStockCode(null);
                        }),
                    },
                  ]
            }
          />
        </Drawer>
      </Drawer>
    </>
  );
};

export default observer(StockPage);
