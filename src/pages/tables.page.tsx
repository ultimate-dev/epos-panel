import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Col, Row } from "reactstrap";
import { Drawer, Tabs } from "antd";
import _ from "lodash";
import i18n from "i18n";
// Components
import DataTable from "components/common/DataTable";
import Breadcrumb from "components/common/Breadcrumb";
import DataForm, { controlForm } from "components/common/DataForm";
// Controllers
import TableController from "controllers/table.controller";
import CategoryController from "controllers/category.controller";
// Constants
import { Status } from "constants/statuses";
import { RULES } from "constants/forms";
import { StatusColor } from "constants/colors";

const CATEGORY_COLUMNS: any[] = [
  { key: "name", title: "Kat", type: "text", search: true },
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
    label: "Kat Adı",
    key: "name",
    type: "text",
    rules: [RULES["REQUIRED"]],
  },
];

const CATEGORY_DEFAULT: any = {
  status: Status["ACTIVE"],
};

const TABLE_COLUMNS: any[] = [
  {
    key: "tableNum",
    title: "Masa Numarası",
    width: 300,
    type: "number",
    search: true,
  },
  {
    key: "category.name",
    title: "Kat",
    type: "text",
  },
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

const TABLE_FORM: any[] = [
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
    label: "Masa Numarası",
    key: "tableNum",
    type: "number",
    rules: [RULES["REQUIRED"]],
  },
  {
    label: "Kat",
    key: "categoryId",
    type: "select",
    include: "categories",
    rules: [RULES["REQUIRED"]],
  },
];

const TABLE_DEFAULT: any = {
  status: Status["ACTIVE"],
};

const TablesPage = () => {
  let [tableC] = useState(new TableController());
  let [categoryC] = useState(() => new CategoryController());

  useEffect(() => {
    tableC.get();
    categoryC.get("TABLE");
  }, []);

  return (
    <>
      <Breadcrumb title={i18n.t("routes.tables")} />
      <Row>
        <Col>
          <Tabs type="card">
            <Tabs.TabPane tab={i18n.t("routes.tables")} key="tables">
              <DataTable
                columns={TABLE_COLUMNS}
                data={tableC.tables}
                actions={[
                  {
                    icon: "edit",
                    color: "primary",
                    onClick: (record) => tableC.setTable(record),
                  },
                ]}
                buttons={[
                  {
                    text: "Yeni Masa",
                    color: "primary",
                    onClick: (initial) => tableC.setTable(initial),
                  },
                  {
                    text: "Yenile",
                    color: "secondary",
                    onClick: () => tableC.get(),
                  },
                ]}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={i18n.t("routes.floors")} key="categories">
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
                    text: "Yeni Kat",
                    color: "primary",
                    onClick: (initial) => categoryC.setCategory(initial),
                  },
                  {
                    text: "Yenile",
                    color: "secondary",
                    onClick: () => categoryC.get("TABLE"),
                  },
                ]}
                expanded={{
                  name: "tables",
                  columns: TABLE_COLUMNS.filter((col) => col.key !== "category.name"),
                  actions: [
                    {
                      icon: "edit",
                      color: "primary",
                      onClick: (record) => tableC.setTable(record),
                    },
                  ],
                }}
              />
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
      <Drawer
        title={!categoryC.category?.id ? "Kat Oluştur" : "Kat Bilgileri"}
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
                      categoryC.create({ ...values, type: "TABLE" }, () => {
                        categoryC.setCategory(null);
                        categoryC.get("TABLE");
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
                        categoryC.get("TABLE");
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
                        categoryC.get("TABLE");
                      }),
                  },
                ]
          }
        />
      </Drawer>

      <Drawer
        title={!tableC.table?.id ? "Masa Oluştur" : "Masa Bilgileri"}
        open={!_.isNull(tableC.table)}
        onClose={() => tableC.setTable(null)}
      >
        <DataForm
          defaultValues={{ ...TABLE_DEFAULT, ...tableC.table }}
          form={controlForm(TABLE_FORM, {
            categories: categoryC.categories.map((cat) => ({
              label: cat.name,
              value: cat.id,
            })),
          })}
          buttons={
            !tableC.table?.id
              ? [
                  {
                    text: "İptal",
                    color: "secondary",
                    onClick: (values) => tableC.setTable(null),
                  },
                  {
                    text: "Oluştur",
                    color: "primary",
                    submit: true,
                    onClick: (values) =>
                      tableC.create(values, () => {
                        categoryC.get("TABLE");
                        tableC.get();
                        tableC.setTable(null);
                      }),
                  },
                ]
              : [
                  {
                    text: "Sil",
                    color: "danger",
                    onClick: (values) =>
                      tableC.delete(values, () => {
                        categoryC.get("TABLE");
                        tableC.get();
                        tableC.setTable(null);
                      }),
                  },
                  {
                    text: "İptal",
                    color: "secondary",
                    onClick: (values) => tableC.setTable(null),
                  },
                  {
                    text: "Kaydet",
                    color: "primary",
                    submit: true,
                    onClick: (values) =>
                      tableC.update(values, () => {
                        categoryC.get("TABLE");
                        tableC.get();
                        tableC.setTable(null);
                      }),
                  },
                ]
          }
        />
      </Drawer>
    </>
  );
};

export default observer(TablesPage);
