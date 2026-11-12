/** @format */

import { describe, expect, it } from "vitest";
import { currencyManager } from "./currency-manager";
import { calculateShortPaymentReference } from "./utils";

describe("Request SDK compatibility", () => {
  it("preserves the reference used to match a request to its payments", () => {
    // This fixed vector is shared with the SDK's payment-reference tests.
    expect(
      calculateShortPaymentReference("01847474747474", "8d03ea7", "0x000001"),
    ).toBe("0xa0098add01acc736");
  });

  it("resolves Ethereum USDC with the decimals used to display payment amounts", () => {
    expect(
      currencyManager.fromAddress("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"),
    ).toMatchObject({ symbol: "USDC", decimals: 6 });
  });
});
