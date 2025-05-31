import { Client } from "@microsoft/microsoft-graph-client";
import type { User } from "@microsoft/microsoft-graph-types";

import { Provider, ProviderConfig } from "./types";

export const MICROSOFT_OAUTH_SCOPES = [
  "https://graph.microsoft.com/User.Read",
  "https://graph.microsoft.com/Calendars.Read",
  "https://graph.microsoft.com/Calendars.Read.Shared",
  "https://graph.microsoft.com/Calendars.ReadBasic",
  "https://graph.microsoft.com/Calendars.ReadWrite",
  "https://graph.microsoft.com/Calendars.ReadWrite.Shared",
  "offline_access",
];

export class MicrosoftProvider implements Provider {
  private graphClient: Client;

  constructor(public config: ProviderConfig) {
    this.graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => config.auth.accessToken,
      },
    });
  }

  public getScope(): string {
    return MICROSOFT_OAUTH_SCOPES.join(" ");
  }

  public async getUserInfo() {
    const user: User = await this.graphClient
      .api("/me")
      .select("id,displayName,userPrincipalName,mail")
      .get();

    return {
      email: user.mail ?? user.userPrincipalName ?? "",
      name: user.displayName ?? "",
      image: "",
    };
  }
}
