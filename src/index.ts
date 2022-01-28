import SpecGraphClient from './client'
export * from 'graphql-request'

const graph = new SpecGraphClient()

export { graph, SpecGraphClient }
