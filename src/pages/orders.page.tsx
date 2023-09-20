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
import OrderController from "controllers/order.controller";
// Constants
import { OrderStatus, PaymentTypeStatus } from "constants/statuses";
import { RULES } from "constants/forms";
import { OrderProductStatusColor, OrderStatusColor, PaymentTypeColor } from "constants/colors";
import { calcTotalModifierSelect } from "services/order.service";
import moment from "moment";
import { toJS } from "mobx";

const ORDER_COLUMNS: any[] = [
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
    title: "Toplam Tutar",
    type: "price",
  },
  {
    key: "completed",
    title: "Hesap Durumu",
    type: "tag",
    tags: [
      {
        label: "Tamamlandı",
        value: true,
        color: "blue",
      },
      {
        label: "Bekleniyor",
        value: false,
        color: "yellow",
      },
    ],
  },
  {
    key: "updatedAt",
    title: "Son Düzenleme",
    type: "date",
  },
];

const ORDER_FORM: any[] = [
  {
    span: 6,
    label: "Hesap Durumu",
    key: "completed",
    type: "switch",
    props: {
      unCheckedChildren: "Bekleniyor",
      checkedChildren: "Tamamlandı",
    },
    rules: [RULES.REQUIRED],
  },
  {
    span: 6,
    label: "Ödeme Tipi",
    key: "type",
    type: "select",
    props: {
      placeholder: i18n.t("paymentType.CASH"),
      options: [
        PaymentTypeStatus.CASH,
        PaymentTypeStatus.CREDIT,
        PaymentTypeStatus.CANCELLED,
        PaymentTypeStatus.RETURNED,
      ].map((type: any) => ({
        label: i18n.t("paymentType." + type),
        value: type,
      })),
    },
    control: (values: any) => {
      return values.completed;
    },
    rules: [RULES.REQUIRED],
  },
];

const ORDER_DEFAULT: any = {};

const OrdersPage = () => {
  let [orderC] = useState(() => new OrderController());
  let [dateRange, setDateRange]: any = useState({ startDate: new Date(), endDate: new Date() });

  useEffect(() => {
    orderC.getGroups(dateRange);
  }, [dateRange]);

  return (
    <>
      <Breadcrumb title={i18n.t("routes.orders")} />
      <Row>
        <Col>
          <Tabs type="card">
            <Tabs.TabPane tab={i18n.t("routes.orders")} key="tables">
              <DataTable
                columns={ORDER_COLUMNS}
                data={orderC.orderGroups}
                actions={[
                  {
                    icon: "edit",
                    color: "primary",
                    onClick: (record) => orderC.setOrderGroup(record),
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
                    onClick: () => orderC.getGroups(dateRange),
                  },
                ]}
              />
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>

      <Drawer
        title={"Sipariş Bilgileri"}
        open={!_.isNull(orderC.orderGroup)}
        onClose={() => orderC.setOrderGroup(null)}
        width={700}
      >
        <DataForm
          defaultValues={{ ...ORDER_DEFAULT, ...orderC.orderGroup }}
          form={controlForm(ORDER_FORM)}
          buttons={[
            {
              text: "Yazır",
              color: "secondary",
              onClick: (record) => {},
            },
            {
              text: "İptal",
              color: "secondary",
              onClick: (values) => orderC.setOrderGroup(null),
            },
            {
              text: "Kaydet",
              color: "primary",
              submit: true,
              onClick: (values) =>
                orderC.updateGroup(values, () => {
                  orderC.setOrderGroup(null);
                  orderC.getGroups(dateRange);
                }),
            },
          ]}
        />
        <hr />
        <div className="my-2">
          <div className="bg-secondary text-center p-2">
            <h2 className="m-0 text-primary">
              <b>{Number(orderC.orderGroup?.totalPrice).toFixed(2) + " TL"}</b>
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
                #{orderC.orderGroup?.table.category.name}-{orderC.orderGroup?.table.tableNum}
              </td>
            </tr>
            <tr>
              <td>
                <b>Sipariş Grubu</b>
              </td>
              <td>{orderC.orderGroup?.groupId}</td>
            </tr>
            <tr>
              <td>
                <b>Hesap Durumu</b>
              </td>
              <td>
                {orderC.orderGroup?.completed ? (
                  <Tag color={"blue"}>Tamamlandı</Tag>
                ) : (
                  <Tag color={"yellow"}>Bekleniyor</Tag>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <b>Son Düzenleme</b>
              </td>
              <td>{moment(orderC.orderGroup?.updatedAt).format("DD.MM.YYYY - HH:mm")}</td>
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
            {orderC.orderGroup?.orders.map((order) => (
              <>
                <tr>
                  <td className="text-center">{order.id}</td>
                  <td>
                    {/* @ts-ignore */}
                    <Tag color={OrderStatusColor[order.status]}>
                      {i18n.t("orderStatus." + order.status)}
                    </Tag>
                  </td>
                  <td className="text-center">{Number(order.totalPrice).toFixed(2) + " TL"}</td>
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
            ))}
          </tbody>
        </table>
        <h5 className="my-3">Ürünler</h5>
        <table className="table table-sm table-bordered my-3">
          <thead>
            <tr>
              <th className="text-center" style={{ width: "15%" }}>
                Sipariş ID
              </th>
              <th style={{ width: "40%" }}>Ürün</th>
              <th className="text-center" style={{ width: "10%" }}>
                Miktar
              </th>
              <th className="text-end" style={{ width: "15%" }}>
                Fiyat
              </th>
              <th style={{ width: "10%" }}>Ödeme Durumu</th>
              <th style={{ width: "10%" }}>Durum</th>
            </tr>
          </thead>
          <tbody>
            {orderC.orderGroup?.orders.map((order) => {
              return order?.orderProducts.map((orderProduct) => {
                return (
                  <>
                    <tr>
                      <td className="text-center">{order.id}</td>
                      <td>
                        <span>{orderProduct.product.name}</span>
                      </td>
                      <td className="text-center">
                        <span className="me-1">{orderProduct.count}</span>
                        <span>{i18n.t("quantityType." + orderProduct.product.quantityType)}</span>
                      </td>
                      <td className="text-end">
                        {orderProduct.product.originalPrice == orderProduct.product.sellingPrice ? (
                          <span>
                            <b>{Number(orderProduct.product.sellingPrice).toFixed(2) + " TL"}</b>
                          </span>
                        ) : (
                          <span>
                            <small>
                              <s className="me-1">
                                {Number(orderProduct.product.originalPrice).toFixed(2) + " TL"}
                              </s>
                            </small>
                            <br />
                            <b>{Number(orderProduct.product.sellingPrice).toFixed(2) + " TL"}</b>
                          </span>
                        )}
                      </td>
                      <td className="text-end">
                        {orderProduct.paymentItem?.payment.type ? (
                          <Tag color={PaymentTypeColor[orderProduct.paymentItem?.payment.type]}>
                            {i18n.t("paymentType." + orderProduct.paymentItem?.payment.type)}
                          </Tag>
                        ) : (
                          <Tag color={OrderStatusColor[order.status]}>
                            {i18n.t("orderStatus." + order.status)}
                          </Tag>
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
                                    modifierProduct.id == modidierSelection.modifierProductId
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
                              calcTotalModifierSelect(orderProduct.modifierSelections, [
                                modifierGroup,
                              ])
                            ).toFixed(2) + " TL"}
                          </small>
                        </td>
                      </tr>
                    ))}
                  </>
                );
              });
            })}
          </tbody>
        </table>
      </Drawer>
    </>
  );
};

export default observer(OrdersPage);
