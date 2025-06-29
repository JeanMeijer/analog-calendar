import deepmerge from "deepmerge";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type ApiKeys = {
  [apiKey: string]: string;
};

const baseApiKeysAtom = atomWithStorage<ApiKeys>("analog-api-keys", {});

export const apiKeysAtom = atom(
  (get) => get(baseApiKeysAtom),
  (get, set, update: ApiKeys) => {
    const currentKeys = get(baseApiKeysAtom);
    const mergedKeys = deepmerge(currentKeys, update);
    set(baseApiKeysAtom, mergedKeys);
  },
);
