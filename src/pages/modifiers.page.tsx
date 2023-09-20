import { Button, Card, Segmented, Tabs, Collapse } from "antd";
import Breadcrumb from "components/common/Breadcrumb";
import DataForm, { controlForm } from "components/common/DataForm";
import { Loader } from "components/Loading";
import { RULES } from "constants/forms";
import { Status } from "constants/statuses";
import CategoryController from "controllers/category.controller";
import ModifierController from "controllers/modifier.controller";
import ProductController from "controllers/product.controller";
import i18n from "i18n";
import _ from "lodash";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";

const MODIFIER_GROUP_FORM: any[] = [
  {
    span: 4,
    label: "Seçenek Başlığı",
    key: "name",
    type: "text",
    rules: [RULES["REQUIRED"]],
  },
  {
    span: 2,
    label: "Çoklu Seçim",
    key: "multiple",
    type: "switch",
  },
  {
    span: 4,
    label: "Zorunlu Seçim",
    key: "required",
    type: "switch",
    control: (values: any) => !values.multiple,
  },
  {
    span: 2,
    label: "Minimum Seçim",
    key: "min",
    type: "number",
    control: (values: any) => values.multiple,
  },
  {
    span: 2,
    label: "Maksimum Seçim",
    key: "max",
    type: "number",
    control: (values: any) => values.multiple,
  },
  {
    span: 2,
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
];

const MODIFIER_PRODUCT_FORM: any[] = [
  {
    span: 4,
    label: "Seçenek Adı",
    key: "name",
    type: "text",
    rules: [RULES["REQUIRED"]],
  },
  {
    span: 4,
    label: "Seçenek Fiyatı",
    key: "price",
    type: "price",
    rules: [RULES["REQUIRED"]],
  },
  {
    span: 4,
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
];

const MODIFIER_GROUP_DEFAULT = {
  status: Status["ACTIVE"],
};

const MODIFIER_PRODUCT_DEFAULT = {
  status: Status["ACTIVE"],
  price: 0,
};

const ModifiersPage = () => {
  let [modifierC] = useState(new ModifierController());
  let [productC] = useState(new ProductController());
  let [categoryC] = useState(new CategoryController());
  let [categoryId, setCategoryId]: any = useState(-1);
  let [modifierGroups, setModifierGroups] = useState<ModifierGroupPattern[]>([]);
  let [modifierProducts, setModifierProducts] = useState<ModifierProductPattern[]>([]);

  useEffect(() => {
    modifierC.get();
    productC.get();
    categoryC.get("PRODUCT");
  }, []);

  return (
    <>
      <Breadcrumb title={i18n.t("routes.modifiers")} />
      <Row>
        <Col>
          <Tabs type="card">
            <Tabs.TabPane tab={i18n.t("routes.modifiers")} key="modifiers">
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

                  <Collapse accordion>
                    {productC.products
                      .filter((product) => product.categoryId == categoryId || categoryId == -1)
                      .map((product) => (
                        <Collapse.Panel header={product.name} key={product.id}>
                          <Row className="m-0">
                            {modifierC.modifiers
                              .filter((modifierGroup) => modifierGroup.productId === product.id)
                              .map((modifierGroup) => (
                                <Col
                                  md={12}
                                  className="p-3 my-2 border-secondary"
                                  style={{ border: "1px dashed" }}
                                >
                                  <ModifierGroupForm
                                    defaultValues={modifierGroup}
                                    onDelete={(values) =>
                                      modifierC.delete(values, () => modifierC.get())
                                    }
                                    onUpdate={(values) =>
                                      modifierC.update(values, () => modifierC.get())
                                    }
                                  />
                                  <h5 className="m-0">Seçenekler</h5>
                                  {modifierGroup.modifierProducts && (
                                    <Row className="m-0">
                                      <Collapse accordion className="my-3">
                                        {modifierGroup.modifierProducts.map(
                                          (modifierProduct, index) => (
                                            <Collapse.Panel
                                              header={modifierProduct.name}
                                              key={modifierProduct.id}
                                            >
                                              <ModifierProductForm
                                                defaultValues={modifierProduct}
                                                onDelete={(values) =>
                                                  modifierC.deleteProduct(values, () =>
                                                    modifierC.get()
                                                  )
                                                }
                                                onUpdate={(values) =>
                                                  modifierC.updateProduct(values, () =>
                                                    modifierC.get()
                                                  )
                                                }
                                              />
                                            </Collapse.Panel>
                                          )
                                        )}
                                        {modifierProducts
                                          .filter(
                                            (modifierProduct) =>
                                              modifierProduct.modifierGroupId === modifierGroup.id
                                          )
                                          .map((modifierProduct, index) => (
                                            <Collapse.Panel
                                              header={modifierProduct.name}
                                              key={index + "new"}
                                            >
                                              <ModifierProductForm
                                                defaultValues={{ ...modifierProduct, id: null }}
                                                onRemove={(values) => {
                                                  let i = modifierProducts.findIndex(
                                                    (item) => item.id == modifierProduct.id
                                                  );
                                                  setModifierProducts([
                                                    ...modifierProducts.slice(0, i),
                                                    ...modifierProducts.slice(i + 1),
                                                  ]);
                                                }}
                                                onCreate={(values) =>
                                                  modifierC.createProduct(values, () =>
                                                    modifierC.get()
                                                  )
                                                }
                                              />
                                            </Collapse.Panel>
                                          ))}
                                      </Collapse>
                                      <Button
                                        color="dashed"
                                        className="btn border-primary text-primary"
                                        style={{ border: "1px dashed" }}
                                        onClick={() => {
                                          let modiferProduct: any = {
                                            modifierGroupId: modifierGroup.id,
                                            id: _.uniqueId("modifierProduct_"),
                                          };
                                          setModifierProducts([
                                            ...modifierProducts,
                                            modiferProduct,
                                          ]);
                                        }}
                                      >
                                        Seçenek Ekle
                                      </Button>
                                    </Row>
                                  )}
                                </Col>
                              ))}

                            {modifierGroups
                              .filter((modifierGroup) => modifierGroup.productId === product.id)
                              .map((modifierGroup, index) => (
                                <Col
                                  md={12}
                                  className="p-3 my-2 border-secondary"
                                  style={{ border: "1px dashed" }}
                                >
                                  <ModifierGroupForm
                                    defaultValues={modifierGroup}
                                    onRemove={(values) =>
                                      setModifierGroups([
                                        ...modifierGroups.slice(0, index),
                                        ...modifierGroups.slice(index + 1),
                                      ])
                                    }
                                    onCreate={(values) =>
                                      modifierC.create(values, () => modifierC.get())
                                    }
                                  />
                                </Col>
                              ))}

                            <Button
                              color="dashed"
                              className="btn border-primary text-primary"
                              style={{ border: "1px dashed" }}
                              onClick={() => {
                                let modifierGroup: any = {
                                  productId: product.id,
                                };
                                setModifierGroups([...modifierGroups, modifierGroup]);
                              }}
                            >
                              Ekle
                            </Button>
                          </Row>
                        </Collapse.Panel>
                      ))}
                  </Collapse>
                </Card>
              </Loader>
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </>
  );
};
export default observer(ModifiersPage);

class ModifierGroupFormProps {
  onUpdate?: (value: any) => void;
  onCreate?: (value: any) => void;
  onRemove?: (value: any) => void;
  onDelete?: (value: any) => void;
  defaultValues: any;
}
const ModifierGroupForm = observer(
  ({
    defaultValues,
    onUpdate = () => {},
    onCreate = () => {},
    onRemove = () => {},
    onDelete = () => {},
  }: ModifierGroupFormProps) => {
    return (
      <DataForm
        form={controlForm(MODIFIER_GROUP_FORM, {})}
        defaultValues={{ ...MODIFIER_GROUP_DEFAULT, ...defaultValues }}
        buttons={
          defaultValues.id
            ? [
                {
                  text: "Sil",
                  color: "danger",
                  onClick: (values) => onDelete(values),
                },
                {
                  text: "Sıfırla",
                  color: "secondary",
                  onClick: async (values, form) => {
                    form.setFieldsValue(defaultValues);
                  },
                },
                {
                  text: "Kaydet",
                  color: "primary",
                  submit: true,
                  onClick: (values) => onUpdate(values),
                },
              ]
            : [
                {
                  text: "İptal",
                  color: "secondary",
                  onClick: (values) => onRemove(values),
                },
                {
                  text: "Oluştur",
                  color: "primary",
                  submit: true,
                  onClick: (values) => {
                    onCreate(values);
                    onRemove(values);
                  },
                },
              ]
        }
      />
    );
  }
);

class ModifierProductFormProps {
  onUpdate?: (value: any) => void;
  onCreate?: (value: any) => void;
  onRemove?: (value: any) => void;
  onDelete?: (value: any) => void;
  defaultValues: any;
}
const ModifierProductForm = observer(
  ({
    defaultValues,
    onUpdate = () => {},
    onCreate = () => {},
    onRemove = () => {},
    onDelete = () => {},
  }: ModifierProductFormProps) => {
    return (
      <DataForm
        form={controlForm(MODIFIER_PRODUCT_FORM, {})}
        defaultValues={{ ...MODIFIER_PRODUCT_DEFAULT, ...defaultValues }}
        buttons={
          defaultValues.id
            ? [
                {
                  text: "Sil",
                  color: "danger",
                  onClick: (values) => onDelete(values),
                },
                {
                  text: "Sıfırla",
                  color: "secondary",
                  onClick: async (values, form) => {
                    form.setFieldsValue(defaultValues);
                  },
                },
                {
                  text: "Kaydet",
                  color: "primary",
                  submit: true,
                  onClick: (values) => onUpdate(values),
                },
              ]
            : [
                {
                  text: "İptal",
                  color: "secondary",
                  onClick: (values) => onRemove(values),
                },
                {
                  text: "Oluştur",
                  color: "primary",
                  submit: true,
                  onClick: (values) => {
                    onCreate(values);
                    onRemove(values);
                  },
                },
              ]
        }
      />
    );
  }
);
