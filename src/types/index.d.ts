declare global {
  type StatusType = "ACTIVE" | "PASSIVE" | "DELETED";
  type LocaleCodesType = "TR" | "EN" | "DE" | "DA" | "FR" | "ES" | "AR" | "FA";
  type Undefined<T> = T | undefined;
  type Nullable<T> = T | null;
}

export {};
