import { describe, it, expect, vi } from "vitest";
import { setupWorld } from "../typescript/contracts.gen";
import type { DojoProvider, DojoCall } from "@dojoengine/core";
import type { InvokeFunctionResponse, Result } from "starknet";

// Minimal provider mock with only the methods we use
function makeProvider() {
const execute = vi.fn(async (_acct: unknown, _call: DojoCall | DojoCall[], _ns: string) => {
  void _acct; void _call; void _ns; // mark unused
  return { transaction_hash: "0xabc" } as InvokeFunctionResponse;
});

const call = vi.fn(async (_ns: string, _call: DojoCall) => {
  void _ns; void _call; // mark unused
  return [] as unknown as Result;
});
  return { execute, call } as unknown as DojoProvider;
}

describe("generated wrappers", () => {
  it("calls execute wrappers with NAMESPACE and returns InvokeFunctionResponse", async () => {
    const provider = makeProvider();
    const { AquaStark } = setupWorld(provider);

    const tx = await AquaStark.newFish({} as any, 1n, {} as any);
    expect((tx as InvokeFunctionResponse).transaction_hash).toBe("0xabc");

    const execute = (provider as any).execute;
    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute.mock.calls[0][2]).toBe("aqua_stark"); 
    const callArg = execute.mock.calls[0][1];
    expect(callArg).toMatchObject({ entrypoint: "new_fish" });
  });

  it("calls view wrappers with NAMESPACE and returns Result", async () => {
    const provider = makeProvider();
    const { AquaStark } = setupWorld(provider);

    const res = await AquaStark.getFish(1n);
    expect(Array.isArray(res as unknown[])).toBe(true);

    const call = (provider as any).call;
    expect(call).toHaveBeenCalledTimes(1);
    expect(call.mock.calls[0][0]).toBe("aqua_stark"); 
    const callArg = call.mock.calls[0][1];
    expect(callArg).toMatchObject({ entrypoint: "get_fish" });
  });
});
