import { Button, Card, Checkbox, DatePicker } from "antd";
import Breadcrumb from "components/common/Breadcrumb";
import i18n from "i18n";
import moment from "moment";
import { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import Widget from "components/common/Widget";
import Chart from "components/common/Chart";
import { Loader } from "components/Loading";
import { observer } from "mobx-react-lite";
import CaseController from "controllers/case.controller";
import Empty from "antd/es/empty";

const CasePage = () => {
  let [caseC] = useState(new CaseController());
  let [dateRange, setDateRange]: any = useState({ startDate: new Date(), endDate: new Date() });

  useEffect(() => {
    caseC.get(dateRange);
  }, []);

  const calcPercent = (value: number, total: number) => {
    return (value * 100) / total || 0;
  };
  return (
    <>
      <Loader>
        <Breadcrumb title={i18n.t("routes.case")} />
        <Row>
          <Col>
            <Card size="small" className="mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Checkbox>Yemeksepeti</Checkbox>
                  <Checkbox>Getir</Checkbox>
                  <Checkbox>Trendyol</Checkbox>
                </div>
                <div>
                  <span className="mx-2">
                    <DatePicker.RangePicker
                      value={[moment(dateRange.startDate), moment(dateRange.endDate)]}
                      onChange={(e: any) =>
                        setDateRange({ startDate: new Date(e[0]), endDate: new Date(e[1]) })
                      }
                      disabledDate={(date) => date >= moment(new Date())}
                    />
                  </span>
                  <span className="mx-2">
                    <Button
                      className="btn btn-primary"
                      onClick={() => {
                        caseC.get(dateRange);
                      }}
                    >
                      Sorgula
                    </Button>
                  </span>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Widget.Box
              color="primary"
              title="Kasa Toplam"
              value={caseC.case.completedTotal.price}
              icon="currency"
              label="Kazanca Oranı"
              percent={calcPercent(
                caseC.case.completedTotal.price,
                caseC.case.completedTotal.price + caseC.case.expenseTotal.price
              )}
            />
          </Col>
          <Col md={4}>
            <Widget.Box
              color="orange"
              title="Gider"
              value={caseC.case.expenseTotal.price}
              icon="money-dollar-box"
              label="Kazanca Oranı"
              percent={calcPercent(
                caseC.case.expenseTotal.price,
                caseC.case.completedTotal.price + caseC.case.expenseTotal.price
              )}
            />
          </Col>
          <Col md={4}>
            <Widget.Box
              color="success"
              title="Kazanç"
              value={caseC.case.completedTotal.price + caseC.case.expenseTotal.price}
              icon="funds-box"
              label="Net Kazanç"
              percent={calcPercent(
                caseC.case.completedTotal.price + caseC.case.expenseTotal.price,
                caseC.case.completedTotal.price
              )}
            />
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <Widget.Progress
              color="primary"
              title="Nakit"
              values={[
                {
                  label: "Ödeme",
                  value: caseC.case.cashTotal.count + " Adet",
                },
                {
                  label: "Tutar",
                  value: Number(caseC.case.cashTotal.price).toFixed(2) + " TL",
                },
              ]}
              percent={calcPercent(caseC.case.cashTotal.price, caseC.case.total.price)}
            />
          </Col>
          <Col md={3}>
            <Widget.Progress
              color="primary"
              title="Kredi Kartı"
              values={[
                {
                  label: "Ödeme",
                  value: caseC.case.creditTotal.count + " Adet",
                },
                {
                  label: "Tutar",
                  value: Number(caseC.case.creditTotal.price).toFixed(2) + " TL",
                },
              ]}
              percent={calcPercent(caseC.case.creditTotal.price, caseC.case.total.price)}
            />
          </Col>
          <Col md={3}>
            <Widget.Progress
              color="warning"
              title="İndirim"
              values={[
                {
                  label: "Ödeme",
                  value: caseC.case.discountTotal.count + " Adet",
                },
                {
                  label: "Tutar",
                  value: Number(caseC.case.discountTotal.price).toFixed(2) + " TL",
                },
              ]}
              percent={calcPercent(caseC.case.discountTotal.price, caseC.case.total.price)}
            />
          </Col>
          <Col md={3}>
            <Widget.Progress
              color="warning"
              title="Para Üstü"
              values={[
                {
                  label: "Ödeme",
                  value: caseC.case.changeTotal.count + " Adet",
                },
                {
                  label: "Tutar",
                  value: Number(caseC.case.changeTotal.price).toFixed(2) + " TL",
                },
              ]}
              percent={calcPercent(caseC.case.changeTotal.price, caseC.case.total.price)}
            />
          </Col>
          <Col md={3}>
            <Widget.Progress
              color="purple"
              title="Tamamlanan"
              values={[
                {
                  label: "Sipariş",
                  value: caseC.case.completedTotal.count + " Adet",
                },
                {
                  label: "Tutar",
                  value: Number(caseC.case.completedTotal.price).toFixed(2) + " TL",
                },
              ]}
              percent={calcPercent(caseC.case.completedTotal.price, caseC.case.total.price)}
            />
          </Col>
          <Col md={3}>
            <Widget.Progress
              color="purple"
              title="Bekleyen"
              values={[
                {
                  label: "Sipariş",
                  value: caseC.case.createdTotal.count + " Adet",
                },
                {
                  label: "Tutar",
                  value: Number(caseC.case.createdTotal.price).toFixed(2) + " TL",
                },
              ]}
              percent={calcPercent(
                caseC.case.createdTotal.price,
                caseC.case.total.price + caseC.case.createdTotal.price
              )}
            />
          </Col>
          <Col md={3}>
            <Widget.Progress
              color="danger"
              title="İptal"
              values={[
                {
                  label: "Sipariş",
                  value: caseC.case.cancelledTotal.count + " Adet",
                },
                {
                  label: "Tutar",
                  value: Number(caseC.case.cancelledTotal.price).toFixed(2) + " TL",
                },
              ]}
              percent={calcPercent(caseC.case.cancelledTotal.price, caseC.case.total.price)}
            />
          </Col>
          <Col md={3}>
            <Widget.Progress
              color="danger"
              title="İade"
              values={[
                {
                  label: "Sipariş",
                  value: caseC.case.returnedTotal.count + " Adet",
                },
                {
                  label: "Tutar",
                  value: Number(caseC.case.returnedTotal.price).toFixed(2) + " TL",
                },
              ]}
              percent={calcPercent(caseC.case.returnedTotal.price, caseC.case.total.price)}
            />
          </Col>
          <Col md={3}>
            <Widget.Progress
              color="orange"
              title="Nakit Gider"
              values={[
                {
                  label: "Toplam",
                  value: Number(caseC.case.cashExpenseTotal.price).toFixed(2) + " TL",
                },
              ]}
              percent={calcPercent(
                caseC.case.cashExpenseTotal.price,
                caseC.case.expenseTotal.price
              )}
            />
          </Col>
          <Col md={3}>
            <Widget.Progress
              color="orange"
              title="Kart Gider"
              values={[
                {
                  label: "Toplam",
                  value: Number(caseC.case.creditExpenseTotal.price).toFixed(2) + " TL",
                },
              ]}
              percent={calcPercent(
                caseC.case.creditExpenseTotal.price,
                caseC.case.expenseTotal.price
              )}
            />
          </Col>
          <Col md={3}>
            <Widget.Progress
              color="success"
              title="Nakit Kazanç"
              values={[
                {
                  label: "Toplam",
                  value:
                    Number(caseC.case.cashTotal.price + caseC.case.cashExpenseTotal.price).toFixed(
                      2
                    ) + " TL",
                },
              ]}
              percent={calcPercent(
                caseC.case.cashTotal.price + caseC.case.cashExpenseTotal.price,
                caseC.case.total.price + caseC.case.expenseTotal.price
              )}
            />
          </Col>
          <Col md={3}>
            <Widget.Progress
              color="success"
              title="Kart Kazanç"
              values={[
                {
                  label: "Toplam",
                  value:
                    Number(
                      caseC.case.creditTotal.price + caseC.case.creditExpenseTotal.price
                    ).toFixed(2) + " TL",
                },
              ]}
              percent={calcPercent(
                caseC.case.creditTotal.price + caseC.case.creditExpenseTotal.price,
                caseC.case.total.price + caseC.case.expenseTotal.price
              )}
            />
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Widget.Box
              color="danger"
              title="Yemek sepeti"
              value={0}
              icon="checkbox-blank-circle"
              label="Aylık Ortalama"
              percent={0}
            />
          </Col>
          <Col md={4}>
            <Widget.Box
              color="purple"
              title="Getir"
              value={0}
              icon="checkbox-blank-circle"
              label="Aylık Ortalama"
              percent={0}
            />
          </Col>
          <Col md={4}>
            <Widget.Box
              color="orange"
              title="Trendyol Yemek"
              value={0}
              icon="checkbox-blank-circle"
              label="Aylık Ortalama"
              percent={-0}
            />
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Widget.Chart title="Gider Özeti">
              {caseC.chart.expenseTypes.length > 0 ? (
                <Chart.DoughnutChart
                  labels={caseC.chart.expenseTypes.map(({ name }) => name)}
                  datasets={[
                    {
                      label: "Gider Özeti",
                      data: caseC.chart.expenseTypes.map(({ payments }) =>
                        payments.reduce((sum, { totalPrice }) => sum + totalPrice, 0)
                      ),
                    },
                  ]}
                />
              ) : (
                <Empty />
              )}
            </Widget.Chart>
          </Col>
          <Col md={8}>
            <Widget.Chart title="Kasa Özeti">
              {caseC.chart.payments.length > 0 ? (
                <Chart.AreaChart
                  labels={caseC.chart.payments.map(({ paymentDate }) =>
                    moment(paymentDate).format("DD MMMM ddd. - HH:mm")
                  )}
                  datasets={[
                    {
                      label: "Giderler",
                      data: caseC.chart.payments.map(({ expenseTypeId, totalPrice }) =>
                        expenseTypeId !== null ? totalPrice : 0
                      ),
                    },
                    {
                      label: "Kasa Toplam",
                      data: caseC.chart.payments.map(({ expenseTypeId, totalPrice }) =>
                        expenseTypeId == null ? totalPrice : 0
                      ),
                    },
                  ]}
                />
              ) : (
                <Empty />
              )}
            </Widget.Chart>
          </Col>
        </Row>
      </Loader>
    </>
  );
};
export default observer(CasePage);
