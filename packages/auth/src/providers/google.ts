import { people } from "@googleapis/people";
import { OAuth2Client } from "google-auth-library";

import { env } from "@repo/env/server";

import { Provider, ProviderConfig } from "./types";

export const GOOGLE_OAUTH_SCOPES = [
  "email",
  "profile",
  "openid",
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

export class GoogleProvider implements Provider {
  private auth;
  private people;

  constructor(public config: ProviderConfig) {
    this.auth = new OAuth2Client({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    });

    if (config.auth) {
      this.auth.setCredentials({
        access_token: config.auth.accessToken,
        refresh_token: config.auth.refreshToken,
        scope: GOOGLE_OAUTH_SCOPES.join(" "),
      });
    }

    this.people = people({
      version: "v1",
      auth: this.auth,
    });
  }

  public getScope(): string {
    return GOOGLE_OAUTH_SCOPES.join(" ");
  }

  async getUserInfo() {
    try {
      const response = await this.people.people.get({
        resourceName: "people/me",
        personFields: "names,photos,emailAddresses",
      });

      return {
        email: response.data.emailAddresses?.[0]?.value ?? "",
        name: response.data.names?.[0]?.displayName ?? "",
        image: response.data.photos?.[0]?.url ?? "",
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
