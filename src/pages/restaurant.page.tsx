import { Card } from "antd";
import Breadcrumb from "components/common/Breadcrumb";
import DataForm, { controlForm } from "components/common/DataForm";
import { RULES } from "constants/forms";
import RestaurantController from "controllers/restaurant.controller";
import i18n from "i18n";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import MStore from "store/main.store";

const RESTAURANT_FORM: any = [
  {
    span: 12,
    label: "Banner",
    key: "banner",
    type: "image",
    rules: [RULES["REQUIRED"]],
  },
  {
    span: 4,
    label: "Logo",
    key: "logo",
    type: "image",
    rules: [RULES["REQUIRED"]],
  },
  {
    span: 5,
    label: "Bayi Adı",
    key: "name",
    type: "text",
    rules: [RULES["REQUIRED"]],
  },
  {
    span: 3,
    label: "Dil",
    key: "locale",
    type: "select",
    props: {
      options: Object.values(i18n.translations).map(({ key, label }) => ({
        label: label,
        value: String(key).toUpperCase(),
      })),
    },
    rules: [RULES["REQUIRED"]],
  },
];
const RestaurantPage = () => {
  let [restaurantC] = useState(new RestaurantController());
  useEffect(() => {
    if (MStore.restaurantId) restaurantC.getOne(MStore.restaurantId);
  }, [MStore.restaurantId]);
  return (
    <>
      <Breadcrumb title={i18n.t("routes.restaurant")} />
      <Card>
        <DataForm
          form={controlForm(RESTAURANT_FORM)}
          defaultValues={restaurantC.restaurant}
          buttons={[
            {
              text: "Sıfırla",
              color: "secondary",
              onClick: async (values, form) => {
                form.setFieldsValue(restaurantC.restaurant);
              },
            },
            {
              text: "Kaydet",
              color: "primary",
              submit: true,
              onClick: (values) => {
                restaurantC.update(values, () => {
                  if (MStore.restaurantId) restaurantC.getOne(MStore.restaurantId);
                });
              },
            },
          ]}
        />
      </Card>
    </>
  );
};
export default observer(RestaurantPage);
