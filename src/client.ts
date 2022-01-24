import { stripTrailingSlash } from './lib/helpers'
import codes from './lib/codes'
import { GraphQLClient } from 'graphql-request'
import { RequestDocument, Variables, ClientError } from './lib/types'

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
            return { data, error: null, status: codes.SUCCESS }
        } catch (error) {
            if ((error as ClientError).response) {
                const { status, message } = (error as ClientError).response
                return { data: null, error: message, status }
            }
            return { data: null, error: error as string, status: codes.INTERNAL_SERVER_ERROR }
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
