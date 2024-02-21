import { createRouter } from "@swan-io/chicane";

const routesObject = {
  Home: "/",
  Strategies: "/strategies",
  FieldsListener: "/fields-listener",
  AsyncSubmission: "/async-submission",
  Checkboxes: "/checkboxes",
  IBAN: "/iban",
  CreditCard: "/credit-card",
  InputMasking: "/input-masking",
} as const;

export const routes = Object.keys(routesObject) as (keyof typeof routesObject)[];

export const Router = createRouter(routesObject, {
  basePath: "/use-form",
});
