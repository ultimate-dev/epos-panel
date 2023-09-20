import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Col, Row } from "reactstrap";
import { DatePicker, Drawer, Tabs, Tag } from "antd";
import _ from "lodash";
import i18n from "i18n";
// Components
import DataTable from "components/common/DataTable";
import Breadcrumb from "components/common/Breadcrumb";
import DataForm, { controlForm } from "components/common/DataForm";
// Controllers
import PaymentController from "controllers/payment.controller";
// Constants
import { PaymentTypeStatus } from "constants/statuses";
import { OrderProductStatusColor, OrderStatusColor, PaymentTypeColor } from "constants/colors";
import { RULES } from "constants/forms";
import moment from "moment";
import { calcTotalModifierSelect } from "services/order.service";

const INCOME_COLUMNS: any[] = [
  {
    key: "groupId",
    title: "Sipariş Gurubu",
    type: "text",
  },
  {
    key: "table",
    title: "Masa",
    type: "custom",
    render: (table: any) => (
      <span>
        #{table?.category.name}-{table?.tableNum}
      </span>
    ),
  },
  {
    key: "totalPrice",
    title: "Ödenen Tutar",
    type: "price",
  },
  {
    key: "paymentDate",
    title: "Ödeme Tarihi",
    type: "date",
  },
];

const EXPENSE_COLUMNS: any[] = [
  {
    key: "expenseType.name",
    title: "Gider Türü",
    type: "text",
  },
  {
    key: "type",
    title: "Ödeme Tipi",
    type: "tag",
    tags: Object.values(PaymentTypeStatus).map((type: any) => ({
      label: i18n.t("paymentType." + type),
      value: type,
      color: PaymentTypeColor[type],
    })),
  },
  {
    key: "totalPrice",
    title: "Toplam Tutar",
    type: "price",
  },
  {
    key: "paymentDate",
    title: "Ödeme Tarihi",
    type: "date",
  },
  {
    key: "createdAt",
    title: "Oluşturma Tarihi",
    type: "date",
  },
];
const EXPENSE_FORM: any[] = [
  {
    label: "Gider Türü",
    key: "expenseTypeId",
    type: "select",
    include: "expenseTypes",
    rules: [RULES["REQUIRED"]],
  },
  {
    span: 6,
    key: "expenseTypeId",
    type: "button",
    props: {
      children: "Güncelle",
      color: "secondary",
    },
    include: "onEditExpenseType",
  },
  {
    span: 6,
    key: "expenseTypeId",
    type: "button",
    props: {
      children: "Yeni",
      color: "primary",
    },
    include: "onNewExpenseType",
  },
  {
    label: "Ödeme Tarihi",
    key: "paymentDate",
    type: "date",
    rules: [RULES["REQUIRED"]],
  },
  {
    label: "Ödeme Tipi",
    key: "type",
    type: "select",
    props: {
      options: [PaymentTypeStatus.CASH, PaymentTypeStatus.CREDIT].map((type: any) => ({
        label: i18n.t("paymentType." + type),
        value: type,
      })),
    },
    rules: [RULES["REQUIRED"]],
    span: 6,
  },
  {
    label: "Fiyat",
    key: "totalPrice",
    type: "price",
    rules: [RULES["REQUIRED"]],
    span: 6,
  },
  {
    label: "Açıklama",
    key: "description",
    type: "textarea",
  },
];
const EXPENSE_DEFAULT: any = {};
const EXPENSE_TYPE_FORM: any[] = [
  {
    label: "Gider Türü",
    key: "name",
    type: "text",
    rules: [RULES["REQUIRED"]],
  },
];
const EXPENSE_TYPE_DEFAULT: any = {};

const PaymentPage = () => {
  let [paymentC] = useState(new PaymentController());
  let [dateRange, setDateRange]: any = useState({ startDate: new Date(), endDate: new Date() });

  useEffect(() => {
    paymentC.getGroups(dateRange);
    paymentC.getExpenses(dateRange);
    paymentC.getExpenseTypes();
  }, [dateRange]);

  return (
    <>
      <Breadcrumb title={i18n.t("routes.payments")} />
      <Row>
        <Col>
          <Tabs type="card">
            <Tabs.TabPane tab={i18n.t("routes.income")} key="incomes">
              <DataTable
                columns={INCOME_COLUMNS}
                data={paymentC.paymentGroups}
                actions={[
                  {
                    icon: "eye",
                    color: "secondary",
                    onClick: (record) => paymentC.setPaymentGroup(record),
                  },
                  {
                    icon: "printer",
                    color: "secondary",
                    onClick: (record) => {},
                  },
                ]}
                buttons={[
                  <DatePicker.RangePicker
                    value={[moment(dateRange.startDate), moment(dateRange.endDate)]}
                    onChange={(e: any) =>
                      setDateRange({ startDate: new Date(e[0]), endDate: new Date(e[1]) })
                    }
                    disabledDate={(date) => date >= moment(new Date())}
                  />,
                  {
                    text: "Yenile",
                    color: "secondary",
                    onClick: () => paymentC.getGroups(dateRange),
                  },
                ]}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={i18n.t("routes.expense")} key="expenses">
              <DataTable
                columns={EXPENSE_COLUMNS}
                data={paymentC.expenses}
                actions={[
                  {
                    icon: "edit",
                    color: "primary",
                    onClick: (record) => paymentC.setExpense(record),
                  },
                ]}
                buttons={[
                  <DatePicker.RangePicker
                    value={[moment(dateRange.startDate), moment(dateRange.endDate)]}
                    onChange={(e: any) =>
                      setDateRange({ startDate: new Date(e[0]), endDate: new Date(e[1]) })
                    }
                    disabledDate={(date) => date >= moment(new Date())}
                  />,
                  {
                    text: "Gider Ekle",
                    color: "primary",
                    onClick: (record) => paymentC.setExpense(record),
                  },
                  {
                    text: "Yenile",
                    color: "secondary",
                    onClick: () => paymentC.getExpenses(dateRange),
                  },
                ]}
              />
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>

      <Drawer
        title={!paymentC.expense?.id ? "Gider Oluştur" : "Gider Bilgileri"}
        open={!_.isNull(paymentC.expense)}
        onClose={() => paymentC.setExpense(null)}
      >
        <DataForm
          defaultValues={{ ...EXPENSE_DEFAULT, ...paymentC.expense }}
          form={controlForm(EXPENSE_FORM, {
            onEditExpenseType: (id: number) =>
              paymentC.setExpenseType(paymentC.expenseTypes.find((type) => type.id == id) || null),
            onNewExpenseType: (id: number, obj: any = {}) => paymentC.setExpenseType(obj),
            expenseTypes: paymentC.expenseTypes.map((expenseType) => ({
              label: expenseType.name,
              value: expenseType.id,
            })),
          })}
          buttons={
            !paymentC.expense?.id
              ? [
                  {
                    text: "İptal",
                    color: "secondary",
                    onClick: (values) => paymentC.setExpense(null),
                  },
                  {
                    text: "Oluştur",
                    color: "primary",
                    submit: true,
                    onClick: (values) =>
                      paymentC.createExpense(values, () => {
                        paymentC.getExpenses(dateRange);
                        paymentC.setExpense(null);
                      }),
                  },
                ]
              : [
                  {
                    text: "Sil",
                    color: "danger",
                    onClick: (values) =>
                      paymentC.deleteExpense(values, () => {
                        paymentC.getExpenses(dateRange);
                        paymentC.setExpense(null);
                      }),
                  },
                  {
                    text: "İptal",
                    color: "secondary",
                    onClick: (values) => paymentC.setExpense(null),
                  },
                  {
                    text: "Kaydet",
                    color: "primary",
                    submit: true,
                    onClick: (values) =>
                      paymentC.updateExpense(values, () => {
                        paymentC.getExpenses(dateRange);
                        paymentC.setExpense(null);
                      }),
                  },
                ]
          }
        />
        <Drawer
          title={!paymentC.expenseType?.id ? "Gider Türü Oluştur" : "Gider Türü Bilgileri"}
          open={!_.isNull(paymentC.expenseType)}
          onClose={() => paymentC.setExpenseType(null)}
        >
          <DataForm
            defaultValues={{ ...EXPENSE_TYPE_DEFAULT, ...paymentC.expenseType }}
            form={controlForm(EXPENSE_TYPE_FORM)}
            buttons={
              !paymentC.expenseType?.id
                ? [
                    {
                      text: "İptal",
                      color: "secondary",
                      onClick: (values) => paymentC.setExpenseType(null),
                    },
                    {
                      text: "Oluştur",
                      color: "primary",
                      submit: true,
                      onClick: (values) =>
                        paymentC.createExpenseType(values, () => {
                          paymentC.getExpenseTypes();
                          paymentC.getExpenses(dateRange);
                          paymentC.setExpenseType(null);
                        }),
                    },
                  ]
                : [
                    {
                      text: "Sil",
                      color: "danger",
                      onClick: (values) =>
                        paymentC.deleteExpenseType(values, () => {
                          paymentC.getExpenseTypes();
                          paymentC.getExpenses(dateRange);
                          paymentC.setExpenseType(null);
                        }),
                    },
                    {
                      text: "İptal",
                      color: "secondary",
                      onClick: (values) => paymentC.setExpenseType(null),
                    },
                    {
                      text: "Kaydet",
                      color: "primary",
                      submit: true,
                      onClick: (values) =>
                        paymentC.updateExpenseType(values, () => {
                          paymentC.getExpenseTypes();
                          paymentC.getExpenses(dateRange);
                          paymentC.setExpenseType(null);
                        }),
                    },
                  ]
            }
          />
        </Drawer>
      </Drawer>

      <Drawer
        title={"Ödeme Bilgileri"}
        open={!_.isNull(paymentC.paymentGroup)}
        onClose={() => paymentC.setPaymentGroup(null)}
        width={600}
      >
        <div className="my-2">
          <div className="bg-secondary text-center p-2">
            <h2 className="m-0 text-primary">
              <b>{Number(paymentC.paymentGroup?.totalPrice).toFixed(2) + " TL"}</b>
            </h2>
          </div>
        </div>
        <table className="table table-sm table-bordered my-3">
          <tbody>
            <tr>
              <td>
                <b>Masa</b>
              </td>
              <td>
                #{paymentC.paymentGroup?.table.category.name}-
                {paymentC.paymentGroup?.table.tableNum}
              </td>
            </tr>
            <tr>
              <td>
                <b>Sipariş Grubu</b>
              </td>
              <td>{paymentC.paymentGroup?.groupId}</td>
            </tr>
            <tr>
              <td>
                <b>Son Düzenleme</b>
              </td>
              <td>{moment(paymentC.paymentGroup?.paymentDate).format("DD.MM.YYYY - HH:mm")}</td>
            </tr>
          </tbody>
        </table>
        <h5 className="my-3">Siparişler</h5>
        <table className="table table-sm table-bordered my-3">
          <thead>
            <tr>
              <th className="text-center" style={{ width: "20%" }}>
                ID
              </th>
              <th style={{ width: "35%" }}>Sipariş Durumu</th>
              <th className="text-center" style={{ width: "20%" }}>
                Toplam Tutar
              </th>
              <th className="text-end" style={{ width: "25%" }}>
                Sipariş Tarihi
              </th>
            </tr>
          </thead>
          <tbody>
            {paymentC.paymentGroup?.payments.map((payment) =>
              payment.paymentItems.map((paymentItem) =>
                paymentItem.orderProducts
                  .filter((orderProduct) => orderProduct.paymentItemId == paymentItem.id)
                  .map(({ order }) => (
                    <>
                      <tr>
                        <td className="text-center">{order.id}</td>
                        <td>
                          {/* @ts-ignore */}
                          <Tag color={OrderStatusColor[order.status]}>
                            {i18n.t("orderStatus." + order.status)}
                          </Tag>
                        </td>
                        <td className="text-center">
                          {Number(order.totalPrice).toFixed(2) + " TL"}
                        </td>
                        <td className="text-end">
                          {moment(order.orderDate).format("DD.MM.YYYY - HH:mm")}
                        </td>
                      </tr>
                      {order.note && (
                        <tr>
                          <td colSpan={3}>
                            <b className="me-1">Not:</b>
                            <i>{order.note}</i>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
              )
            )}
          </tbody>
        </table>
        <h5 className="my-3">Ödemeler</h5>
        <table className="table table-sm table-bordered my-3">
          <thead>
            <tr>
              <th className="text-center" style={{ width: "60%" }}>
                Ödeme ID
              </th>
              <th className="text-center" style={{ width: "20%" }}>
                Toplam Tutar
              </th>
              <th style={{ width: "20%" }}>Ödeme Türü</th>
            </tr>
          </thead>
          <tbody>
            {paymentC.paymentGroup?.payments.map((payment) => (
              <>
                <tr>
                  <td className="text-center">{payment.id}</td>
                  <td className="text-center">{Number(payment.totalPrice).toFixed(2) + " TL"}</td>
                  <td>
                    {/* @ts-ignore */}
                    <Tag color={PaymentTypeColor[payment.type]}>
                      {i18n.t("paymentType." + payment.type)}
                    </Tag>
                  </td>
                </tr>
                {payment.paymentItems.filter(
                  (paymentItem) =>
                    paymentItem.orderProducts.filter(
                      (orderProduct) => orderProduct.paymentItemId == paymentItem.id
                    ).length > 0
                ).length > 0 && (
                  <tr className="bg-secondary">
                    <td colSpan={3}>
                      <table className="table table-sm table-bordered m-0 bg-white">
                        <thead>
                          <tr>
                            <th className="text-center" style={{ width: "15%" }}>
                              Sipariş ID
                            </th>
                            <th style={{ width: "40%" }}>Ürün</th>
                            <th className="text-center" style={{ width: "15%" }}>
                              Miktar
                            </th>
                            <th className="text-end" style={{ width: "15%" }}>
                              Fiyat
                            </th>
                            <th style={{ width: "15%" }}>Durum</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payment.paymentItems?.map((paymentItem) =>
                            paymentItem?.orderProducts
                              .filter(
                                (orderProduct) => orderProduct.paymentItemId == paymentItem.id
                              )
                              .map((orderProduct) => (
                                <>
                                  <tr>
                                    <td className="text-center">{orderProduct.orderId}</td>
                                    <td>
                                      <span>{orderProduct.product.name}</span>
                                    </td>
                                    <td className="text-center">
                                      <span className="me-1">{orderProduct.count}</span>
                                      <span>
                                        {i18n.t(
                                          "quantityType." + orderProduct.product.quantityType
                                        )}
                                      </span>
                                    </td>
                                    <td className="text-end">
                                      {orderProduct.product.originalPrice ==
                                      orderProduct.product.sellingPrice ? (
                                        <span>
                                          <b>
                                            {Number(orderProduct.product.sellingPrice).toFixed(2) +
                                              " TL"}
                                          </b>
                                        </span>
                                      ) : (
                                        <span>
                                          <small>
                                            <s className="me-1">
                                              {Number(orderProduct.product.originalPrice).toFixed(
                                                2
                                              ) + " TL"}
                                            </s>
                                          </small>
                                          <br />
                                          <b>
                                            {Number(orderProduct.product.sellingPrice).toFixed(2) +
                                              " TL"}
                                          </b>
                                        </span>
                                      )}
                                    </td>
                                    <td className="text-end">
                                      {/* @ts-ignore */}
                                      <Tag color={OrderProductStatusColor[orderProduct.status]}>
                                        {i18n.t("orderProductStatus." + orderProduct.status)}
                                      </Tag>
                                    </td>
                                  </tr>
                                  {orderProduct.product.modifierGroups.map((modifierGroup) => (
                                    <tr className="bg-secondary">
                                      <td colSpan={4} className="ps-3">
                                        <span className="me-1">{modifierGroup.name}:</span>
                                        <small>
                                          {orderProduct.modifierSelections
                                            .map((modidierSelection) => {
                                              let selection = modifierGroup.modifierProducts.find(
                                                (modifierProduct) =>
                                                  modifierProduct.id ==
                                                  modidierSelection.modifierProductId
                                              );

                                              return selection
                                                ? selection.name +
                                                    "(" +
                                                    Number(selection.price).toFixed(2) +
                                                    " TL)"
                                                : "";
                                            })
                                            .join(", ")}
                                        </small>
                                      </td>
                                      <td className="text-end">
                                        <small>
                                          {Number(
                                            calcTotalModifierSelect(
                                              orderProduct.modifierSelections,
                                              [modifierGroup]
                                            )
                                          ).toFixed(2) + " TL"}
                                        </small>
                                      </td>
                                    </tr>
                                  ))}
                                </>
                              ))
                          )}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </Drawer>
    </>
  );
};

export default observer(PaymentPage);
