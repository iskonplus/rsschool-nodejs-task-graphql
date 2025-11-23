import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';
import { GraphQLError } from 'graphql';
import { PrismaClient, User, Post, MemberType, Profile  } from '@prisma/client';

import {
  UserType,
  ProfileType,
  PostType,
  MemberTypeType,
} from './types/index.js';
import { UUIDScalar } from './scalars.js';

type GqlContext = {
  prisma: PrismaClient;
};

const RootQueryType = new GraphQLObjectType<GqlContext>({
  name: 'RootQueryType',
  fields: () => ({

    // get users
    users: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(UserType)),
      ),
      async resolve(
        _source: unknown,
        _args: unknown,
        context: GqlContext,
      ): Promise<User[]> {
        const { prisma } = context;
        return prisma.user.findMany();
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
      ): Promise<User> {
        const { prisma } = context;

        const user = await prisma.user.findUnique({
          where: { id: args.id },
        });

        if (!user) {
          throw new GraphQLError('User not found');
        }

        return user;
      },
    },

    // get posts
    posts: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(PostType)),
      ),
      async resolve(
        _source: unknown,
        _args: unknown,
        context: GqlContext,
      ): Promise<Post[]> {
        const { prisma } = context;
        return prisma.post.findMany();
      },
    },

    // get posts by id
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDScalar) },
      },
      async resolve(
        _source: unknown,
        args: { id: string },
        context: GqlContext,
      ): Promise<Post> {
        const { prisma } = context;

        const post = await prisma.post.findUnique({
          where: { id: args.id },
        });

        if (!post) {
          throw new GraphQLError('Post not found');
        }

        return post;
      },
    },

    // get member-types
    memberTypes: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(MemberTypeType)),
      ),
      async resolve(
        _source: unknown,
        _args: unknown,
        context: GqlContext,
      ): Promise<MemberType[]> {
        const { prisma } = context;
        return prisma.memberType.findMany();
      },
    },

    // get profiles
    profiles: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(ProfileType)),
      ),
      async resolve(
        _source: unknown,
        _args: unknown,
        context: GqlContext,
      ): Promise<Profile[]> {
        const { prisma } = context;
        return prisma.profile.findMany();
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
