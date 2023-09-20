import { Tabs } from "antd";
import Breadcrumb from "components/common/Breadcrumb";
import DataTable from "components/common/DataTable";
import TrashController from "controllers/trash.controller";
import i18n from "i18n";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
const TrashPage = () => {
  let [trashC] = useState(new TrashController());
  let [dateRange, setDateRange]: any = useState({ startDate: new Date(), endDate: new Date() });

  useEffect(() => {
    trashC.get(dateRange);
  }, []);
  return (
    <>
      <Breadcrumb title={i18n.t("routes.trash")} />
    </>
  );
};
export default observer(TrashPage);
