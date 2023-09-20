import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Col, Row } from "reactstrap";
import { Card, Collapse, Drawer, Segmented, Spin, Tabs } from "antd";
import _ from "lodash";
import i18n, { translations } from "i18n";
// Components
import DataTable from "components/common/DataTable";
import Breadcrumb from "components/common/Breadcrumb";
import DataForm, { controlForm } from "components/common/DataForm";
// Controllers
import TranslationController from "controllers/translation.controller";
// Constants
import ProductController from "controllers/product.controller";
import RestaurantController from "controllers/restaurant.controller";
import CategoryController from "controllers/category.controller";
import { Loader } from "components/Loading";
import { getTranslationValue, getTranslationForm } from "services/translation.service";
import ModifierController from "controllers/modifier.controller";
import IngredientController from "controllers/ingredient.controller";

const PRODUCT_FIELDS = [
  {
    label: "Ürün Adı",
    key: "name",
  },
  {
    label: "Ürün Açıklaması",
    key: "description",
  },
];

const CATEGORY_PRODUCT_FIELDS = [
  {
    label: "Menü Adı",
    key: "name",
  },
];
const CATEGORY_TABLE_FIELDS = [
  {
    label: "Kat Adı",
    key: "name",
  },
];

const MODIFIER_GROUP_FIELDS = [
  {
    label: "Seçenek Başlığı",
    key: "name",
  },
];

const MODIFIER_PRODUCT_FIELDS = [
  {
    label: "Seçenek Adı",
    key: "name",
  },
];

const INGREDIENT_FIELDS = [
  {
    label: "Ürün İçerik Adı",
    key: "name",
  },
];

const TranslationsPage = () => {
  let [restaurantC] = useState(new RestaurantController());
  let [translationC] = useState(new TranslationController());
  let [productC] = useState(new ProductController());
  let [categoryC] = useState(new CategoryController());
  let [modifierC] = useState(new ModifierController());
  let [ingredientC] = useState(new IngredientController());
  let [categoryId, setCategoryId]: any = useState(-1);

  useEffect(() => {
    restaurantC.get();
    translationC.get();
    productC.get();
    categoryC.get("PRODUCT");
    modifierC.get();
    ingredientC.get();
  }, []);

  const translateCollapse = (
    array: any[],
    fields: any[],
    name: string,
    idName: string,
    titleName: string,
    cb: () => void,
    render?: (item: any) => any
  ) => {
    return (
      <Collapse accordion>
        {array.map((item: any, index) => (
          <Collapse.Panel header={item[titleName]} key={index}>
            {fields.map((field) => (
              <div className="w-100">
                <h6 className="d-flex align-items-center border-bottom pb-1">
                  <i className="ri-checkbox-blank-circle-line mx-2" />
                  <span>{field.label}</span>
                </h6>
                <DataForm
                  defaultValues={Object.values(translations).reduce(
                    (a: any, translation: any) => ({
                      ...a,
                      [translation.key]: getTranslationValue(
                        restaurantC.restaurants,
                        translationC.translations,
                        item,
                        { code: translation.key, path: field.key, idName }
                      ),
                    }),
                    {}
                  )}
                  form={getTranslationForm(restaurantC.restaurants, field.label)}
                  buttons={[
                    {
                      text: "Otomatik Çevir",
                      color: "success",
                      onClick: async (values, form) => {
                        form.setFieldsValue(
                          await translationC.translate(item[field.key], Object.keys(translations))
                        );
                      },
                    },
                    {
                      text: "Sıfırla",
                      color: "secondary",
                      onClick: async (values) => {
                        translationC.get();
                        cb();
                      },
                    },
                    {
                      text: "Kaydet",
                      color: "primary",
                      submit: true,
                      onClick: (values) =>
                        translationC.update(name, field.key, item.id, values, async () => {
                          translationC.get();
                          cb();
                        }),
                    },
                  ]}
                />
                {render && (
                  <div className="w-100 mt-3">
                    <h6 className="d-flex align-items-center">
                      <i className="ri-add-circle-line mx-2" />
                      <span>{item[titleName]}</span>
                    </h6>
                    {render(item)}
                  </div>
                )}
              </div>
            ))}
          </Collapse.Panel>
        ))}
      </Collapse>
    );
  };

  return (
    <>
      <Breadcrumb title={i18n.t("routes.translations")} />
      <Row>
        <Col>
          <Tabs
            type="card"
            onChange={(e) => {
              switch (e) {
                case "menus":
                  categoryC.get("PRODUCT");
                  break;
                case "floors":
                  categoryC.get("TABLE");
                  break;
              }
            }}
          >
            <Tabs.TabPane tab={i18n.t("routes.products")} key="products">
              <Loader>
                <Card className="rounded overflow">
                  <div className="mb-2">
                    <Segmented
                      block
                      options={[
                        { label: "Tümü", value: -1 },
                        ...categoryC.categories.map((category) => ({
                          label: category.name,
                          value: category.id,
                        })),
                      ]}
                      value={categoryId}
                      onChange={(value) => setCategoryId(value)}
                    />
                  </div>
                  {translateCollapse(
                    productC.products.filter(
                      (product) => categoryId === -1 || product.categoryId === categoryId
                    ),
                    PRODUCT_FIELDS,
                    "product",
                    "productId",
                    "name",
                    () => productC.get()
                  )}
                </Card>
              </Loader>
            </Tabs.TabPane>
            <Tabs.TabPane tab={i18n.t("routes.menus")} key="menus">
              <Loader>
                <Card className="rounded overflow">
                  {translateCollapse(
                    categoryC.categories,
                    CATEGORY_PRODUCT_FIELDS,
                    "category",
                    "categoryId",
                    "name",
                    () => categoryC.get("PRODUCT")
                  )}
                </Card>
              </Loader>
            </Tabs.TabPane>
            <Tabs.TabPane tab={i18n.t("routes.floors")} key="floors">
              <Loader>
                <Card className="rounded overflow">
                  {translateCollapse(
                    categoryC.categories,
                    CATEGORY_TABLE_FIELDS,
                    "category",
                    "categoryId",
                    "name",
                    () => categoryC.get("TABLE")
                  )}
                </Card>
              </Loader>
            </Tabs.TabPane>
            <Tabs.TabPane tab={i18n.t("routes.modifiers")} key="modifiers">
              <Loader>
                <Card className="rounded overflow">
                  {translateCollapse(
                    modifierC.modifiers,
                    MODIFIER_GROUP_FIELDS,
                    "modifier",
                    "modifierGroupId",
                    "name",
                    () => modifierC.get(),
                    (item) =>
                      translateCollapse(
                        item.modifierProducts,
                        MODIFIER_PRODUCT_FIELDS,
                        "modifierProduct",
                        "modifierProductId",
                        "name",
                        () => modifierC.get()
                      )
                  )}
                </Card>
              </Loader>
            </Tabs.TabPane>
            <Tabs.TabPane tab={i18n.t("routes.ingredients")} key="ingredients">
              <Loader>
                <Card className="rounded overflow">
                  {translateCollapse(
                    ingredientC.ingredients,
                    INGREDIENT_FIELDS,
                    "ingredient",
                    "ingredientId",
                    "name",
                    () => ingredientC.get()
                  )}
                </Card>
              </Loader>
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </>
  );
};

export default observer(TranslationsPage);
