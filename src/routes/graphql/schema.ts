import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import {
  UserType,
  ProfileType,
  PostType,
  MemberTypeType,
} from './types/index.js';

const RootQueryType = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({}),
});

const Mutations = new GraphQLObjectType({
    name: 'Mutations',
    fields: () => ({}),
});

export const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: Mutations,
});