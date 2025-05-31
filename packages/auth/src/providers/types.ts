export type ProviderConfig = {
  auth: {
    userId: string;
    accessToken: string;
    refreshToken: string;
    email: string;
  };
};

export interface Provider {
  config: ProviderConfig;
  getUserInfo(
    params?: ProviderConfig["auth"],
  ): Promise<{ email: string; name: string; image: string }>;
}
