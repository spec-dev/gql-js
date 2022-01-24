import SpecGraphClient from './client'
import { gql } from 'graphql-request'

const graph = new SpecGraphClient()

export { graph, SpecGraphClient, gql }
