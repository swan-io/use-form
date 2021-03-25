import { cleanup } from "@testing-library/react";
import { useForm } from "../src";

afterEach(cleanup);

it("matches existing api", () => {
  const output = useForm();
  expect(output).toMatchInlineSnapshot(`Object {}`);
});
