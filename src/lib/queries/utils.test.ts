/** @format */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { requestPerChain } from "./utils";

const { request } = vi.hoisted(() => ({ request: vi.fn() }));

vi.mock("../graphQlClient", () => ({
  graphQLClient: {
    request,
  },
}));

const buildQuery = (chain: string) => `query { ${chain} }`;

describe("requestPerChain", () => {
  beforeEach(() => {
    request.mockReset();
  });

  it("merges one entry per chain when all chains succeed", async () => {
    request.mockImplementation((query: string) => {
      if (query.includes("mainnet"))
        return Promise.resolve({ mainnet: { total: 1 } });
      if (query.includes("polygon"))
        return Promise.resolve({ polygon: { total: 2 } });
      return Promise.reject(new Error("unexpected chain"));
    });

    const result = await requestPerChain(
      "test",
      ["mainnet", "polygon"],
      buildQuery,
      {},
    );

    expect(result).toEqual({
      mainnet: { total: 1 },
      polygon: { total: 2 },
    });
  });

  it("skips a rejected chain, keeps the others, and does not throw", async () => {
    request.mockImplementation((query: string) => {
      if (query.includes("mainnet")) return Promise.reject(new Error("boom"));
      if (query.includes("polygon"))
        return Promise.resolve({ polygon: { total: 2 } });
      return Promise.reject(new Error("unexpected chain"));
    });

    const result = await requestPerChain(
      "test",
      ["mainnet", "polygon"],
      buildQuery,
      {},
    );

    expect(result).toEqual({ polygon: { total: 2 } });
  });

  it("skips a chain that resolves without its own bucket, and does not throw", async () => {
    request.mockImplementation((query: string) => {
      if (query.includes("mainnet")) return Promise.resolve({});
      if (query.includes("polygon"))
        return Promise.resolve({ polygon: { total: 2 } });
      return Promise.reject(new Error("unexpected chain"));
    });

    const result = await requestPerChain(
      "test",
      ["mainnet", "polygon"],
      buildQuery,
      {},
    );

    expect(result).toEqual({ polygon: { total: 2 } });
  });

  it("throws naming the failed chains when every chain fails", async () => {
    request.mockImplementation((query: string) => {
      if (query.includes("mainnet")) return Promise.reject(new Error("boom"));
      if (query.includes("polygon")) return Promise.reject(new Error("kaboom"));
      return Promise.reject(new Error("unexpected chain"));
    });

    await expect(
      requestPerChain("test", ["mainnet", "polygon"], buildQuery, {}),
    ).rejects.toThrow(/mainnet.*polygon|polygon.*mainnet/);
  });

  it("does not throw for an empty chains array", async () => {
    const result = await requestPerChain("test", [], buildQuery, {});

    expect(result).toEqual({});
    expect(request).not.toHaveBeenCalled();
  });
});
