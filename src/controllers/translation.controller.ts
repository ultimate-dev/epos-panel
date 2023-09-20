import i18n from "i18n";
import { configure, makeAutoObservable } from "mobx";
// Networking
import axios, { APIS } from "networking";
import toast from "react-hot-toast";
// Services
import IStore from "store/instant.store";

configure({ enforceActions: "never" });

class TranslationController {
  translations: TranslationPattern[] = [];
  constructor() {
    makeAutoObservable(this);
  }
  get = async () => {
    try {
      IStore.showLoader();
      let { data } = await axios.get(APIS.TRANSLATIONS.rawValue);
      IStore.hideLoader();
      if (!data.error) this.translations = <TranslationPattern[]>data.translations;
    } catch (err) {}
    return [];
  };
  translate = async (text: string, locales: string[]) => {
    try {
      IStore.showLoader();
      let { data } = await axios.get(APIS.TRANSLATION_TRANSLATE.rawValue, {
        headers: { locales: JSON.stringify(locales) },
        params: { text },
      });
      IStore.hideLoader();
      return data.translations;
    } catch (err) {}
    return {};
  };
  update = async (name: string, key: string, id: number, translations: any, cb?: () => void) => {
    try {
      IStore.showLoader();
      await axios
        .post(APIS.TRANSLATION.value(name, key, id), { translations })
        .finally(() => toast.success(i18n.t("success.UPDATED")));
      cb && cb();
      IStore.hideLoader();
    } catch (err) {}
  };
}

export default TranslationController;
