"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gql = exports.SpecGraphClient = exports.graph = void 0;
const client_1 = __importDefault(require("./client"));
exports.SpecGraphClient = client_1.default;
const graphql_request_1 = require("graphql-request");
Object.defineProperty(exports, "gql", { enumerable: true, get: function () { return graphql_request_1.gql; } });
const graph = new client_1.default();
exports.graph = graph;
//# sourceMappingURL=index.js.map