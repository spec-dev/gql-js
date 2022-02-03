import { stripTrailingSlash, firstOr } from './lib/helpers'
import codes from './lib/codes'
import { ApiError } from './lib/types'
import { GraphQLClient, RequestDocument, Variables, ClientError } from 'graphql-request'

export default class SpecGraphClient extends GraphQLClient {
    constructor(specUrl: string, specKey: string) {
        if (!specUrl) throw new Error('specUrl is required.')
        if (!specKey) throw new Error('specKey is required.')

        super(`${stripTrailingSlash(specUrl)}/graph/v1`)

        this.setHeader('apikey', specKey)
    }

    useAuthHeader(headers: { [key: string]: any }) {
        this.setHeader('Authorization', headers['authorization'] || headers['Authorization'])
    }

    async query<T = any, V = Variables>(
        document: RequestDocument,
        variables?: V
    ): Promise<{
        data: T | null
        error: ApiError | null
    }> {
        try {
            const data = await this.request(document, variables)
            return { data, error: null }
        } catch (error) {
            if ((error as ClientError).response) {
                const { status, errors = [] } = (error as ClientError).response
                const message = firstOr(errors, {}).message || ''
                return { data: null, error: this._formatError(message, status) }
            }
            return { data: null, error: this._formatError(error as string) }
        }
    }

    async mutate<T = any, V = Variables>(
        document: RequestDocument,
        variables?: V
    ): Promise<{
        data: T | null
        error: ApiError | null
    }> {
        return await this.query(document, variables)
    }

    private _formatError(message: string, status?: number): ApiError {
        return {
            message,
            status: status || codes.INTERNAL_SERVER_ERROR,
        }
    }
}
