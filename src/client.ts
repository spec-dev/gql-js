import { stripTrailingSlash } from './lib/helpers'
import codes from './lib/codes'
import { GraphQLClient, RequestDocument, Variables, ClientError } from 'graphql-request'

export default class SpecGraphClient extends GraphQLClient {
    constructor(url?: string) {
        const baseUrl = url || process.env.SPEC_URL
        if (!baseUrl) throw 'SPEC_URL environment variable not set.'
        const graphUrl = `${stripTrailingSlash(baseUrl)}/graph/v1`
        super(graphUrl)
    }

    takeAuthHeaders(event: { [key: string]: any }) {
        const headers = event.headers ?? event
        this.setHeader('apikey', headers['apikey'] || headers['Apikey'])
        this.setHeader('Authorization', headers['authorization'] || headers['Authorization'])
    }

    async query<T = any, V = Variables>(
        document: RequestDocument,
        variables?: V
    ): Promise<{
        data: T | null
        status: number
        error: string | null
    }> {
        try {
            const data = await this.request(document, variables)
            return { data, status: codes.SUCCESS, error: null }
        } catch (error) {
            if ((error as ClientError).response) {
                const { status, message } = (error as ClientError).response
                return { data: null, status, error: message }
            }
            return { data: null, status: codes.INTERNAL_SERVER_ERROR, error: error as string }
        }
    }

    async mutate<T = any, V = Variables>(
        document: RequestDocument,
        variables?: V
    ): Promise<{
        data: T | null
        error: string | null
    }> {
        return await this.query(document, variables)
    }
}
