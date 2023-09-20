import { Collapse, Drawer, Tabs, Card, Button, Segmented } from "antd";
import Breadcrumb from "components/common/Breadcrumb";
import DataForm, { controlForm } from "components/common/DataForm";
import DataTable from "components/common/DataTable";
import { Loader } from "components/Loading";
import { StatusColor } from "constants/colors";
import { RULES } from "constants/forms";
import { QuantityType, Status } from "constants/statuses";
import CategoryController from "controllers/category.controller";
import IngredientController from "controllers/ingredient.controller";
import ModifierController from "controllers/modifier.controller";
import ProductController from "controllers/product.controller";
import StockController from "controllers/stock.controller";
import i18n from "i18n";
import _ from "lodash";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";

const INGREDIENT_COLUMNS: any[] = [
  { key: "name", title: "Hammade", type: "text" },
  { key: "barcode", title: "Barkod", type: "text" },
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
  {
    key: "status",
    title: "Stok Takip",
    type: "tag",
    tags: Object.values(Status).map((status: any) => ({
      label: i18n.t("status." + status),
      value: status,
      color: StatusColor[status],
    })),
  },
];

const INGREDIENT_FORM: any[] = [
  {
    label: "Stok Takip",
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
    label: "Hammade Adı",
    key: "name",
    type: "text",
    rules: [RULES["REQUIRED"]],
  },
  {
    label: "Barkod",
    key: "barcode",
    type: "text",
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
];

const INGREDIENT_DEFAULT: any = { status: Status.ACTIVE };

const INGREDIENT_STOCK_FORM: any[] = [
  {
    span: 4,
    key: "ingredientId",
    label: "Hammade",
    type: "select",
    include: "ingredients",
    rules: [RULES["REQUIRED"]],
  },
  { span: 4, key: "quantity", label: "Miktar", type: "number", rules: [RULES["REQUIRED"]] },
  {
    span: 4,
    key: "stockCodeId",
    label: "Stok Kodu",
    type: "select",
    include: "stockCodes",
    rules: [RULES["REQUIRED"]],
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

const STOCK_CODE_DEFAULT: any = {
  status: Status["ACTIVE"],
};

const IngredientsPage = () => {
  let [ingredientC] = useState(new IngredientController());
  let [productC] = useState(new ProductController());
  let [categoryC] = useState(new CategoryController());
  let [modifierC] = useState(new ModifierController());
  let [stockC] = useState(new StockController());
  let [ingredientStocks, setIngredientStocs] = useState<IngredientStockPattern[]>([]);
  let [categoryId, setCategoryId]: any = useState(-1);

  useEffect(() => {
    ingredientC.get();
    ingredientC.getStocks();
    productC.get();
    categoryC.get("PRODUCT");
    modifierC.get();
    stockC.getStockCodes();
  }, []);

  return (
    <>
      <Breadcrumb title={i18n.t("routes.ingredient_prescription")} />
      <Row>
        <Col>
          <Tabs type="card">
            <Tabs.TabPane tab={i18n.t("routes.ingredients")} key="ingredients">
              <DataTable
                buttons={[
                  {
                    text: "Yeni Hammade",
                    color: "primary",
                    onClick: (initial) => ingredientC.setIngredient(initial),
                  },
                  {
                    text: "Yenile",
                    color: "secondary",
                    onClick: () => ingredientC.get(),
                  },
                ]}
                data={ingredientC.ingredients}
                actions={[
                  {
                    icon: "edit",
                    color: "primary",
                    onClick: (record) => ingredientC.setIngredient(record),
                  },
                ]}
                columns={INGREDIENT_COLUMNS}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={i18n.t("routes.product_prescription")} key="prescriptions">
              <Loader>
                <Card
                  className="rounded overflow"
                  extra={
                    <div>
                      <Button
                        className="mx-1 btn btn-primary"
                        onClick={() => {
                          let initial: any = {};
                          ingredientC.setIngredient(initial);
                        }}
                      >
                        Yeni Hammade
                      </Button>
                      <Button
                        className="mx-1 btn btn-primary"
                        onClick={() => {
                          let initial: any = {};
                          stockC.setStockCode(initial);
                        }}
                      >
                        Yeni Stok Kodu
                      </Button>
                    </div>
                  }
                >
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
                            {ingredientC.ingredientStocks
                              .filter((ingredientStock) => ingredientStock.productId === product.id)
                              .map((ingredientStock) => (
                                <Col
                                  md={12}
                                  className="p-3 my-2 border-secondary"
                                  style={{ border: "1px dashed" }}
                                >
                                  <IngredientForm
                                    defaultValues={{ ...ingredientStock }}
                                    ingredients={ingredientC.ingredients}
                                    stockCodes={stockC.stockCodes}
                                    onUpdate={(value) =>
                                      ingredientC.updateStock(
                                        { ...value, productId: product.id },
                                        () => ingredientC.getStocks()
                                      )
                                    }
                                    onDelete={(value) =>
                                      ingredientC.deleteStock(
                                        { ...value, productId: product.id },
                                        () => ingredientC.getStocks()
                                      )
                                    }
                                  />
                                </Col>
                              ))}

                            {ingredientStocks
                              .filter((ingredientStock) => ingredientStock.productId === product.id)
                              .map((ingredientStock, index) => (
                                <Col
                                  md={12}
                                  className="p-3 my-2 border-secondary"
                                  style={{ border: "1px dashed" }}
                                >
                                  <IngredientForm
                                    defaultValues={{ ...ingredientStock }}
                                    ingredients={ingredientC.ingredients}
                                    stockCodes={stockC.stockCodes}
                                    onCreate={(value) =>
                                      ingredientC.createStock(
                                        { ...value, productId: product.id },
                                        () => ingredientC.getStocks()
                                      )
                                    }
                                    onRemove={() =>
                                      setIngredientStocs([
                                        ...ingredientStocks.slice(0, index),
                                        ...ingredientStocks.slice(index + 1),
                                      ])
                                    }
                                  />
                                </Col>
                              ))}
                            <Button
                              color="dashed"
                              className="btn border-primary text-primary"
                              style={{ border: "1px dashed" }}
                              onClick={() => {
                                let ingredientStock: any = { productId: product.id };
                                setIngredientStocs([...ingredientStocks, ingredientStock]);
                              }}
                            >
                              Ekle
                            </Button>
                          </Row>
                          {product.modifierGroups.length > 0 && (
                            <>
                              <h5 className="mt-3">Ürün Seçenekleri</h5>
                              {product.modifierGroups.map((modifierGroup) => (
                                <Collapse accordion>
                                  {modifierGroup.modifierProducts.map((modifierProduct) => (
                                    <Collapse.Panel
                                      header={
                                        modifierGroup.name + " (" + modifierProduct.name + ")"
                                      }
                                      key={modifierProduct.id}
                                    >
                                      <Row className="m-0">
                                        {ingredientC.ingredientStocks
                                          .filter(
                                            (ingredientStock) =>
                                              ingredientStock.modifierProductId ===
                                              modifierProduct.id
                                          )
                                          .map((ingredientStock) => (
                                            <Col
                                              md={12}
                                              className="p-3 my-2 border-secondary"
                                              style={{ border: "1px dashed" }}
                                            >
                                              <IngredientForm
                                                defaultValues={{ ...ingredientStock }}
                                                ingredients={ingredientC.ingredients}
                                                stockCodes={stockC.stockCodes}
                                                onUpdate={(value) =>
                                                  ingredientC.updateStock(
                                                    {
                                                      ...value,
                                                      modifierProductId: modifierProduct.id,
                                                    },
                                                    () => ingredientC.getStocks()
                                                  )
                                                }
                                                onDelete={(value) =>
                                                  ingredientC.deleteStock(
                                                    {
                                                      ...value,
                                                      modifierProductId: modifierProduct.id,
                                                    },
                                                    () => ingredientC.getStocks()
                                                  )
                                                }
                                              />
                                            </Col>
                                          ))}

                                        {ingredientStocks
                                          .filter(
                                            (ingredientStock) =>
                                              ingredientStock.modifierProductId ===
                                              modifierProduct.id
                                          )
                                          .map((ingredientStock, index) => (
                                            <Col
                                              md={12}
                                              className="p-3 my-2 border-secondary"
                                              style={{ border: "1px dashed" }}
                                            >
                                              <IngredientForm
                                                defaultValues={{ ...ingredientStock }}
                                                ingredients={ingredientC.ingredients}
                                                stockCodes={stockC.stockCodes}
                                                onCreate={(value) =>
                                                  ingredientC.createStock(
                                                    {
                                                      ...value,
                                                      modifierProductId: modifierProduct.id,
                                                    },
                                                    () => ingredientC.getStocks()
                                                  )
                                                }
                                                onRemove={() =>
                                                  setIngredientStocs([
                                                    ...ingredientStocks.slice(0, index),
                                                    ...ingredientStocks.slice(index + 1),
                                                  ])
                                                }
                                              />
                                            </Col>
                                          ))}
                                        <Button
                                          color="dashed"
                                          className="btn border-primary text-primary"
                                          style={{ border: "1px dashed" }}
                                          onClick={() => {
                                            let ingredientStock: any = {
                                              modifierProductId: modifierProduct.id,
                                            };
                                            setIngredientStocs([
                                              ...ingredientStocks,
                                              ingredientStock,
                                            ]);
                                          }}
                                        >
                                          Ekle
                                        </Button>
                                      </Row>
                                    </Collapse.Panel>
                                  ))}
                                </Collapse>
                              ))}
                            </>
                          )}
                        </Collapse.Panel>
                      ))}
                  </Collapse>
                </Card>
              </Loader>
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
      <Drawer
        title={!ingredientC.ingredient?.id ? "Ürün Oluştur" : "Ürün Bilgileri"}
        open={!_.isNull(ingredientC.ingredient)}
        onClose={() => ingredientC.setIngredient(null)}
      >
        <DataForm
          defaultValues={{ ...INGREDIENT_DEFAULT, ...ingredientC.ingredient }}
          form={controlForm(INGREDIENT_FORM)}
          buttons={
            !ingredientC.ingredient?.id
              ? [
                  {
                    text: "İptal",
                    color: "secondary",
                    onClick: (values) => ingredientC.setIngredient(null),
                  },
                  {
                    text: "Oluştur",
                    color: "primary",
                    submit: true,
                    onClick: (values) =>
                      ingredientC.create(values, () => {
                        ingredientC.setIngredient(null);
                        ingredientC.get();
                      }),
                  },
                ]
              : [
                  {
                    text: "Sil",
                    color: "danger",
                    onClick: (values) =>
                      ingredientC.delete(values, () => {
                        ingredientC.setIngredient(null);
                        ingredientC.get();
                      }),
                  },
                  {
                    text: "İptal",
                    color: "secondary",
                    onClick: (values) => ingredientC.setIngredient(null),
                  },
                  {
                    text: "Kaydet",
                    color: "primary",
                    submit: true,
                    onClick: (values) =>
                      ingredientC.update(values, () => {
                        ingredientC.setIngredient(null);
                        ingredientC.get();
                      }),
                  },
                ]
          }
        />
      </Drawer>

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
                        stockC.setStockCode(null);
                      }),
                  },
                ]
          }
        />
      </Drawer>
    </>
  );
};

class IngredientFormProps {
  ingredients: IngredientPattern[];
  stockCodes: StockCodePattern[];
  onUpdate?: (value: any) => void;
  onCreate?: (value: any) => void;
  onRemove?: (value: any) => void;
  onDelete?: (value: any) => void;
  defaultValues: any;
}

const IngredientForm = observer(
  ({
    ingredients,
    stockCodes,
    defaultValues,
    onUpdate = () => {},
    onCreate = () => {},
    onRemove = () => {},
    onDelete = () => {},
  }: IngredientFormProps) => {
    return (
      <DataForm
        form={controlForm(INGREDIENT_STOCK_FORM, {
          ingredients: ingredients.map((ingredient) => ({
            label: ingredient.name,
            value: ingredient.id,
          })),
          stockCodes: stockCodes.map((stockCode) => ({
            label: stockCode.name,
            value: stockCode.id,
          })),
        })}
        defaultValues={defaultValues}
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

export default observer(IngredientsPage);
