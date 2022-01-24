"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./lib/helpers");
const graphql_request_1 = require("graphql-request");
const status = {
    SUCCESS: 200,
    INTERNAL_SERVER_ERROR: 500,
};
class SpecGraphClient extends graphql_request_1.GraphQLClient {
    constructor(url) {
        const baseUrl = url || process.env.SPEC_URL;
        if (!baseUrl)
            throw 'SPEC_URL environment variable not set.';
        const graphUrl = `${(0, helpers_1.stripTrailingSlash)(baseUrl)}/graph/v1`;
        super(graphUrl);
    }
    takeAuthHeaders(headers) {
        this.setHeader('apikey', headers['apikey'] || headers['Apikey']);
        this.setHeader('Authorization', headers['authorization'] || headers['Authorization']);
    }
    query(document, variables) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.request(document, variables);
                return { data, error: null, status: status.SUCCESS };
            }
            catch (error) {
                if (error.response) {
                    const { status, message } = error.response;
                    return { data: null, error: message, status };
                }
                return { data: null, error: error, status: status.INTERNAL_SERVER_ERROR };
            }
        });
    }
    mutate(document, variables) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query(document, variables);
        });
    }
}
exports.default = SpecGraphClient;
//# sourceMappingURL=client.js.map