import plaid from 'plaid';
export interface PlaidClientConfig {
    clientId: string;
    secret: string;
    publicKey: string;
    environment: string;
}
export declare class Plaid {
    /** 1. Exchange Public Token for Access Token */
    static readonly getAccessToken: (publicToken: string, client: plaid.Client) => Promise<string>;
    /** 2. Exchange Access token for Stripe Token */
    static readonly toStripe: (accessToken: string, accountId: string, client: plaid.Client) => Promise<string>;
    static readonly client: (cfg: PlaidClientConfig) => plaid.Client;
}
