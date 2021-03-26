import { cleanup, render } from "@testing-library/react";
import * as React from "react";
import { useForm } from "../src";

afterEach(cleanup);

test("default form status is untouched", async () => {
  const Form = () => {
    const { formStatus } = useForm({
      foo: { initialValue: "" },
    });

    return <>formStatus: {formStatus}</>;
  };

  const { findByText } = render(<Form />);
  await findByText("formStatus: untouched");
});
