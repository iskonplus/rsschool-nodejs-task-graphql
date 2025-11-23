import { GraphQLSchema, GraphQLObjectType, GraphQLNonNull, GraphQLList } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { UserType, ProfileType, PostType, MemberTypeType } from './types/index.js';

type GqlContext = {
  prisma: PrismaClient;
};

const RootQueryType = new GraphQLObjectType<GqlContext>({
  name: 'RootQueryType',
  fields: () => ({
    // get user
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      async resolve(_src, _args, context) {
        return context.prisma.user.findMany();
      },
    },
  }),
});

const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => ({}),
});

export const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: Mutations,
});
