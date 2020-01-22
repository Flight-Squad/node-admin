import plaid from 'plaid';

export interface PlaidClientConfig {
    clientId: string;
    secret: string;
    publicKey: string;
    environment: string;
}

export class Plaid {
    /** 1. Exchange Public Token for Access Token */
    static readonly getAccessToken = async (publicToken: string, client: plaid.Client): Promise<string> => (await client.exchangePublicToken(publicToken)).access_token;
    /** 2. Exchange Access token for Stripe Token */
    static readonly toStripe = async (accessToken: string, accountId: string, client: plaid.Client): Promise<string> => (await client.createStripeToken(accessToken, accountId)).stripe_bank_account_token;

    static readonly client = (cfg: PlaidClientConfig) => new plaid.Client(
        cfg.clientId,
        cfg.secret,
        cfg.publicKey,
        cfg.environment,
        { version: '2019-05-29' }
    );
}