import SpecGraphClient from './client'
export * from 'graphql-request'

const getSpecGraphClient = () => new SpecGraphClient()

export { getSpecGraphClient, SpecGraphClient }
