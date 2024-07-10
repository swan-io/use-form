import { Dict } from "@swan-io/boxed";
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
  Dynamic: "/dynamic",
} as const;

export const routes = Dict.keys(routesObject);

export const Router = createRouter(routesObject, {
  basePath: "/use-form",
});
