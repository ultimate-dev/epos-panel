import { Button, Tabs } from "antd";
import Breadcrumb from "components/common/Breadcrumb";
import DataTable from "components/common/DataTable";
import RestaurantController from "controllers/restaurant.controller";
import i18n from "i18n";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import MStore from "store/main.store";

const RESTAURANT_COLUMNS: any[] = [
  {
    key: "id",
    title: "...",
    type: "custom",
    width: 240,
    render: (id: number) =>
      MStore.restaurantId == id ? (
        <Button block className="btn btn-secondary">
          Aktif
        </Button>
      ) : (
        <Button
          block
          className="btn btn-success"
          onClick={() => {
            MStore.setRestaurantId(id);
            window.location.reload();
          }}
        >
          Geçiş Yap
        </Button>
      ),
  },
  { key: "name", title: "Bayi Adı", type: "text", search: true },
  {
    key: "locale",
    title: "Dil",
    type: "tag",
    tags: Object.values(i18n.translations).map(({ label, key }: any) => ({
      label,
      value: String(key).toUpperCase(),
    })),
  },
  {
    key: "createdAt",
    title: "Oluşturulma Tarihi",
    type: "date",
  },
];

const RestaurantsPage = () => {
  let [restaurantC] = useState(new RestaurantController());
  useEffect(() => {
    restaurantC.get();
  }, []);
  return (
    <>
      <Breadcrumb title={i18n.t("routes.restaurants")} />
      <Row>
        <Col>
          <Tabs type="card">
            <Tabs.TabPane tab={i18n.t("routes.restaurants")} key="products">
              <DataTable data={restaurantC.restaurants} columns={RESTAURANT_COLUMNS} />
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </>
  );
};
export default observer(RestaurantsPage);
