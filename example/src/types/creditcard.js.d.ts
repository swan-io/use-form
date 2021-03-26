declare module "creditcard.js" {
  export const isValid = (value: string) => boolean;
  export const isExpirationDateValid = (month: string, year: string) => boolean;
  export const isSecurityCodeValid = (value: string) => boolean;
  export const getCreditCardNameByNumber = (value: string) => boolean;
}
