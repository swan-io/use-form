// jest-dom adds custom jest matchers for asserting on DOM nodes
// learn more: https://github.com/testing-library/jest-dom
import matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

// https://testing-library.com/docs/react-testing-library/api/#cleanup
afterEach(cleanup);

// https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#configuring-your-testing-environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

expect.extend(matchers);
