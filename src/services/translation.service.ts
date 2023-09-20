import { RULES } from "constants/forms";
import { translations as locales } from "i18n";
import MStore from "store/main.store";

export const getTranslationValue = (
  restaurants: RestaurantPattern[],
  translations: TranslationPattern[],
  obj: any,
  options: { code: string; path: string; idName: string }
) => {
  let locale = String(
    restaurants.find((restaurant) => restaurant.id == MStore.restaurantId)?.locale
  ).toLowerCase();
  // @ts-ignore
  if (locale && locale == options.code) return obj[options.path];
  else
    return translations.find(
      (translation) =>
        String(translation.code).toLowerCase() == String(options.code).toLowerCase() &&
        translation.area == options.path &&
        // @ts-ignore
        translation[options.idName] == obj.id
    )?.translate;
};

export const getTranslationForm = (restaurants: RestaurantPattern[], placeholder: string) => {
  let locale = String(
    restaurants.find((restaurant) => restaurant.id == MStore.restaurantId)?.locale
  ).toLowerCase();

  let localeTranslate = locales[String(locale).toUpperCase()];

  let form: any = [
    ...Object.values(locales).map((item: any) => ({
      label: item.label,
      key: item.key,
      type: "text",
      span: 3,
    })),
  ];
  if (localeTranslate) {
    let { label = "", key = "" } = localeTranslate;
    form = [
      { label, key, type: "text", span: 3, rules: [RULES.REQUIRED] },
      ...form.filter((item: any) => item.key !== locale),
    ];
  }

  return form.map((item: any) => ({
    ...item,
    props: { placeholder: placeholder + "(" + item.label + ")" },
  }));
};
