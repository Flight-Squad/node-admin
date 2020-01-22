"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plaid_1 = __importDefault(require("plaid"));
class Plaid {
}
exports.Plaid = Plaid;
/** 1. Exchange Public Token for Access Token */
Plaid.getAccessToken = async (publicToken, client) => (await client.exchangePublicToken(publicToken)).access_token;
/** 2. Exchange Access token for Stripe Token */
Plaid.toStripe = async (accessToken, accountId, client) => (await client.createStripeToken(accessToken, accountId)).stripe_bank_account_token;
Plaid.client = (cfg) => new plaid_1.default.Client(cfg.clientId, cfg.secret, cfg.publicKey, cfg.environment, { version: '2019-05-29' });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYWdlbnRzL3BheW1lbnQvcGxhaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFTMUIsTUFBYSxLQUFLOztBQUFsQixzQkFhQztBQVpHLGdEQUFnRDtBQUNoQyxvQkFBYyxHQUFHLEtBQUssRUFBRSxXQUFtQixFQUFFLE1BQW9CLEVBQW1CLEVBQUUsQ0FBQyxDQUFDLE1BQU0sTUFBTSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDO0FBQ3BLLGdEQUFnRDtBQUNoQyxjQUFRLEdBQUcsS0FBSyxFQUFFLFdBQW1CLEVBQUUsU0FBaUIsRUFBRSxNQUFvQixFQUFtQixFQUFFLENBQUMsQ0FBQyxNQUFNLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQztBQUV2TCxZQUFNLEdBQUcsQ0FBQyxHQUFzQixFQUFFLEVBQUUsQ0FBQyxJQUFJLGVBQUssQ0FBQyxNQUFNLENBQ2pFLEdBQUcsQ0FBQyxRQUFRLEVBQ1osR0FBRyxDQUFDLE1BQU0sRUFDVixHQUFHLENBQUMsU0FBUyxFQUNiLEdBQUcsQ0FBQyxXQUFXLEVBQ2YsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLENBQzVCLENBQUMifQ==