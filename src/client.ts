import { stripTrailingSlash } from './lib/helpers'
import codes from './lib/codes'
import { GraphQLClient, RequestDocument, Variables, ClientError } from 'graphql-request'

export default class SpecGraphClient extends GraphQLClient {
    constructor(specUrl: string, specKey: string) {
        if (!specUrl) throw new Error('specUrl is required.')
        if (!specKey) throw new Error('specKey is required.')

        super(`${stripTrailingSlash(specUrl)}/graph/v1`)

        this.setHeader('apikey', specKey)
    }

    takeAuthHeader(headers: { [key: string]: any }) {
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
        status: number
        error: string | null
    }> {
        return await this.query(document, variables)
    }
}
