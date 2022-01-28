import { stripTrailingSlash } from './lib/helpers'
import codes from './lib/codes'
import { GraphQLClient, RequestDocument, Variables, ClientError } from 'graphql-request'

const DEFAULT_OPTIONS = {
    appendUrlSpecGraphPath: true,
}

export default class SpecGraphClient extends GraphQLClient {
    constructor(
        url?: string,
        options?: {
            appendUrlSpecGraphPath?: boolean
        }
    ) {
        url = url || process.env.SPEC_URL
        if (!url)
            throw 'URL to use couldn\'t be determined...was the "SPEC_URL" env var not set?'
        url = stripTrailingSlash(url)
        const settings = { ...DEFAULT_OPTIONS, ...options }
        const graphUrl = settings.appendUrlSpecGraphPath ? `${url}/graph/v1` : url
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
