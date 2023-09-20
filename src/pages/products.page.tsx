import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import i18n from "i18n";
import { Col, Row } from "reactstrap";
import { Drawer, Tabs } from "antd";
import _ from "lodash";
// Components
import DataTable from "components/common/DataTable";
import Breadcrumb from "components/common/Breadcrumb";
import DataForm, { controlForm } from "components/common/DataForm";
// Controllers
import ProductController from "controllers/product.controller";
import CategoryController from "controllers/category.controller";
// Constants
import { QuantityType, Status } from "constants/statuses";
import { RULES } from "constants/forms";
import { StatusColor } from "constants/colors";

const CATEGORY_COLUMNS: any[] = [
  { key: "image", title: "Görsel", type: "image" },
  { key: "name", title: "Menü", type: "text", search: true },
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
];

const CATEGORY_FORM: any[] = [
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
    label: "Görsel",
    key: "image",
    type: "image",
    rules: [RULES["REQUIRED"]],
  },
  {
    label: "Menü Adı",
    key: "name",
    type: "text",
    rules: [RULES["REQUIRED"]],
  },
];

const CATEGORY_DEFAULT: any = { status: "ACTIVE" };

const PRODUCT_COLUMNS: any[] = [
  { key: "image", title: "Görsel", type: "image" },
  { key: "name", title: "Ürün", type: "text", search: true },
  { key: "category.name", title: "Masa", type: "text" },
  {
    key: "quantityType",
    title: "Birim",
    type: "tag",
    tags: Object.values(QuantityType).map((type: any) => ({
      label: i18n.t("quantityType." + type),
      value: type,
      color: "default",
    })),
  },
  { key: "originalPrice", title: "Fiyat", type: "price" },
  { key: "sellingPrice", title: "Satış Fiyatı", type: "price" },
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
];

const PRODUCT_FORM: any[] = [
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
    label: "Görsel",
    key: "image",
    type: "image",
    rules: [RULES["REQUIRED"]],
  },
  {
    label: "Ürün Adı",
    key: "name",
    type: "text",
    rules: [RULES["REQUIRED"]],
  },
  {
    label: "Açıklama",
    key: "description",
    type: "textarea",
  },
  {
    label: "Menü",
    key: "categoryId",
    type: "select",
    include: "categories",
    rules: [RULES["REQUIRED"]],
  },
  {
    label: "Birim",
    key: "quantityType",
    type: "select",
    props: {
      options: Object.values(QuantityType).map((type: any) => ({
        label: i18n.t("quantityType." + type),
        value: type,
      })),
    },
    rules: [RULES["REQUIRED"]],
  },
  {
    label: "Fiyat",
    key: "originalPrice",
    type: "price",
    rules: [RULES["REQUIRED"]],
    span: 6,
  },
  {
    label: "Satış Fiyatı",
    key: "sellingPrice",
    type: "price",
    rules: [RULES["REQUIRED"]],
    span: 6,
  },
];

const PRODUCT_DEFAULT: any = { status: "ACTIVE" };

const ProductsPage = () => {
  let [productC] = useState(new ProductController());
  let [categoryC] = useState(() => new CategoryController());

  useEffect(() => {
    productC.get();
    categoryC.get("PRODUCT");
  }, []);

  return (
    <>
      <Breadcrumb title={i18n.t("routes.products")} />
      <Row>
        <Col>
          <Tabs type="card">
            <Tabs.TabPane tab="Ürünler" key="products">
              <DataTable
                columns={PRODUCT_COLUMNS}
                data={productC.products}
                actions={[
                  {
                    icon: "edit",
                    color: "primary",
                    onClick: (record) => productC.setProduct(record),
                  },
                ]}
                buttons={[
                  {
                    text: "Yeni Ürün",
                    color: "primary",
                    onClick: (initial) => productC.setProduct(initial),
                  },
                  {
                    text: "Yenile",
                    color: "secondary",
                    onClick: () => productC.get(),
                  },
                ]}
              />
            </Tabs.TabPane>

            <Tabs.TabPane tab="Menüler" key="categories">
              <DataTable
                columns={CATEGORY_COLUMNS}
                actions={[
                  {
                    icon: "edit",
                    color: "primary",
                    onClick: (record) => categoryC.setCategory(record),
                  },
                ]}
                data={categoryC.categories}
                buttons={[
                  {
                    text: "Yeni Menü",
                    color: "primary",
                    onClick: (initial) => categoryC.setCategory(initial),
                  },
                  {
                    text: "Yenile",
                    color: "secondary",
                    onClick: () => categoryC.get("PRODUCT"),
                  },
                ]}
                expanded={{
                  name: "products",
                  columns: PRODUCT_COLUMNS.filter((col) => col.key !== "category.name"),
                  actions: [
                    {
                      icon: "edit",
                      color: "primary",
                      onClick: (record) => productC.setProduct(record),
                    },
                  ],
                }}
              />
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
      <Drawer
        title={!categoryC.category?.id ? "Menü Oluştur" : "Menü Bilgileri"}
        open={!_.isNull(categoryC.category)}
        onClose={() => categoryC.setCategory(null)}
      >
        <DataForm
          defaultValues={{ ...CATEGORY_DEFAULT, ...categoryC.category }}
          form={controlForm(CATEGORY_FORM)}
          buttons={
            !categoryC.category?.id
              ? [
                  {
                    text: "İptal",
                    color: "secondary",
                    onClick: (values) => categoryC.setCategory(null),
                  },
                  {
                    text: "Oluştur",
                    color: "primary",
                    submit: true,
                    onClick: (values) =>
                      categoryC.create({ ...values, type: "PRODUCT" }, () => {
                        categoryC.setCategory(null);
                        categoryC.get("PRODUCT");
                      }),
                  },
                ]
              : [
                  {
                    text: "Sil",
                    color: "danger",
                    onClick: (values) =>
                      categoryC.delete(values, () => {
                        categoryC.setCategory(null);
                        categoryC.get("PRODUCT");
                      }),
                  },
                  {
                    text: "İptal",
                    color: "secondary",
                    onClick: (values) => categoryC.setCategory(null),
                  },
                  {
                    text: "Kaydet",
                    color: "primary",
                    submit: true,
                    onClick: (values) =>
                      categoryC.update(values, () => {
                        categoryC.setCategory(null);
                        categoryC.get("PRODUCT");
                      }),
                  },
                ]
          }
        />
      </Drawer>
      <Drawer
        title={!productC.product?.id ? "Ürün Oluştur" : "Ürün Bilgileri"}
        open={!_.isNull(productC.product)}
        onClose={() => productC.setProduct(null)}
      >
        <DataForm
          defaultValues={{ ...PRODUCT_DEFAULT, ...productC.product }}
          form={controlForm(PRODUCT_FORM, {
            categories: categoryC.categories.map((cat) => ({
              label: cat.name,
              value: cat.id,
            })),
          })}
          buttons={
            !productC.product?.id
              ? [
                  {
                    text: "İptal",
                    color: "secondary",
                    onClick: (values) => productC.setProduct(null),
                  },
                  {
                    text: "Oluştur",
                    color: "primary",
                    submit: true,
                    onClick: (values) =>
                      productC.create(values, () => {
                        categoryC.get("PRODUCT");
                        productC.setProduct(null);
                        productC.get();
                      }),
                  },
                ]
              : [
                  {
                    text: "Sil",
                    color: "danger",
                    onClick: (values) =>
                      productC.delete(values, () => {
                        categoryC.get("PRODUCT");
                        productC.setProduct(null);
                        productC.get();
                      }),
                  },
                  {
                    text: "İptal",
                    color: "secondary",
                    onClick: (values) => productC.setProduct(null),
                  },
                  {
                    text: "Kaydet",
                    color: "primary",
                    submit: true,
                    onClick: (values) =>
                      productC.update(values, () => {
                        categoryC.get("PRODUCT");
                        productC.setProduct(null);
                        productC.get();
                      }),
                  },
                ]
          }
        />
      </Drawer>
    </>
  );
};
export default observer(ProductsPage);
