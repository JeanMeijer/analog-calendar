import { GoogleProvider } from "./google";
import { MicrosoftProvider } from "./microsoft";
import type { ProviderConfig } from "./types";

const supportedProviders = {
  google: GoogleProvider,
  microsoft: MicrosoftProvider,
};

export function createdProvider(
  provider: keyof typeof supportedProviders,
  config: ProviderConfig,
) {
  if (!supportedProviders[provider]) {
    throw new Error("Provider not supported");
  }

  return new supportedProviders[provider](config);
}
