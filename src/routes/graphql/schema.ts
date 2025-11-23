import { GraphQLSchema } from 'graphql';
import { RootQueryType } from './resolvers/queries.js';
import { Mutations } from './resolvers/mutations.js';

export const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: Mutations,
});