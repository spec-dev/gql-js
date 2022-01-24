import { GraphQLClient } from 'graphql-request';
import { RequestDocument, Variables, GenericObject } from './lib/types';
export default class SpecGraphClient extends GraphQLClient {
    constructor(url?: string);
    takeAuthHeaders(headers: GenericObject): void;
    query<T = any, V = Variables>(document: RequestDocument, variables?: V): Promise<{
        data: T | null;
        status: number;
        error: string | null;
    }>;
    mutate<T = any, V = Variables>(document: RequestDocument, variables?: V): Promise<{
        data: T | null;
        error: string | null;
    }>;
}
//# sourceMappingURL=client.d.ts.map