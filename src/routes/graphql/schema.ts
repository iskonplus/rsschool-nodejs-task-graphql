import { GraphQLSchema, GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLError } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { UserType, ProfileType, PostType, MemberTypeType } from './types/index.js';
import { UUIDScalar } from './scalars.js';

type GqlContext = {
  prisma: PrismaClient;
};

const RootQueryType = new GraphQLObjectType<GqlContext>({
  name: 'RootQueryType',
  fields: () => ({
    // get users
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      async resolve(_src, _args, context) {
        return context.prisma.user.findMany();
      },
    },

    // get users by id
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDScalar) },
      },
      async resolve(
        _source: unknown,
        args: { id: string },
        context: GqlContext,
      ) {
        const user = await context.prisma.user.findUnique({
          where: { id: args.id },
        });

        if (!user) {
          throw new GraphQLError('User not found');
        }

        return user;
      }
    },


  })
});

const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => ({}),
});

export const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: Mutations,
});
