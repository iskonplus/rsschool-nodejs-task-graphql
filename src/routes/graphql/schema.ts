import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';

import { PrismaClient, Post, MemberType, Profile } from '@prisma/client';

import {
  UserType,
  ProfileType,
  PostType,
  MemberTypeType,
} from './types/index.js';
import { MemberTypeId, UUIDScalar } from './scalars.js';

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
      async resolve(_src, _args, context: GqlContext) {
        const { prisma } = context;

        return prisma.user.findMany({
          include: {
            profile: {
              include: {
                memberType: true,
              },
            },
            posts: true,
            userSubscribedTo: {
              include: {
                author: true,
              },
            },
            subscribedToUser: {
              include: {
                subscriber: true,
              },
            },
          },
        });
      },
    },

    // get user by id
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDScalar) },
      },
      async resolve(_src, args: { id: string }, context: GqlContext) {
        const { prisma } = context;

        const user = await prisma.user.findUnique({
          where: { id: args.id },
          include: {
            profile: {
              include: {
                memberType: true,
              },
            },
            posts: true,
            userSubscribedTo: {
              include: {
                author: {
                  include: {
                    subscribedToUser: {
                      include: {
                        subscriber: true,
                      },
                    },
                  },
                },
              },
            },
            subscribedToUser: {
              include: {
                subscriber: {
                  include: {
                    userSubscribedTo: {
                      include: {
                        author: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        return user ?? null;
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
      async resolve(_src, args: { id: string }, context: GqlContext) {
        const { prisma } = context;

        const post = await prisma.post.findUnique({
          where: { id: args.id },
        });

        return post ?? null;
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

    // get member-types by id
    memberType: {
      type: MemberTypeType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
      },
      async resolve(_src, args, context) {
        const { prisma } = context;

        const memberType = await prisma.memberType.findUnique({
          where: { id: args.id },
        });

        return memberType ?? null;
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

    // get profile by id
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDScalar) },
      },
      async resolve(_src, args: { id: string }, context: GqlContext) {
        const { prisma } = context;

        const profile = await prisma.profile.findUnique({
          where: { id: args.id },
          include: {
            memberType: true,
          },
        });

        return profile ?? null;
      },
    },


  }),

});



const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDScalar) },
  },
});

const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDScalar) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
  },
});

const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDScalar },
    memberTypeId: { type: MemberTypeId },
  },
});

const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});



const Mutations = new GraphQLObjectType<GqlContext>({
  name: 'Mutations',
  fields: () => ({

    // create
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (_src, args, { prisma }) =>
        prisma.user.create({
          data: {
            name: args.dto.name,
            balance: args.dto.balance,
          },
        }),
    },

    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      async resolve(_src, args, { prisma }) {
        const { title, content, authorId } = args.dto;

        return prisma.post.create({
          data: {
            title,
            content,
            author: {
              connect: { id: authorId },
            },
          },
        });
      },
    },

    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (_src, args, { prisma }) => {
        const { isMale, yearOfBirth, userId, memberTypeId } = args.dto;

        const currentYear = new Date().getFullYear();
        if (yearOfBirth < 1900 || yearOfBirth > currentYear) {
          throw new Error('Invalid yearOfBirth');
        }

        return prisma.profile.create({
          data: {
            isMale,
            yearOfBirth,
            userId,
            memberTypeId,
          },
        });
      },
    },

    // delete
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDScalar) },
      },
      resolve: async (_src, args, { prisma }) => {
        await prisma.user.delete({ where: { id: args.id } });
        return 'USER_DELETED';
      },
    },

    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDScalar) },
      },
      resolve: async (_src, args, { prisma }) => {
        await prisma.post.delete({ where: { id: args.id } });
        return 'POST_DELETED';
      },
    },

    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDScalar) },
      },
      resolve: async (_src, args, { prisma }) => {
        await prisma.profile.delete({ where: { id: args.id } });
        return 'PROFILE_DELETED';
      },
    },

    // change
    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDScalar) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (_src, args, { prisma }) =>
        prisma.post.update({
          where: { id: args.id },
          data: args.dto,
        }),
    },

    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDScalar) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (_src, args, { prisma }) => {
        const { dto } = args;

        if (typeof dto.yearOfBirth === 'number') {
          const currentYear = new Date().getFullYear();
          if (dto.yearOfBirth < 1900 || dto.yearOfBirth > currentYear) {
            throw new Error('Invalid yearOfBirth');
          }
        }

        if (dto.userId) {
          const user = await prisma.user.findUnique({
            where: { id: dto.userId },
          });
          if (!user) {
            throw new Error('Invalid userId');
          }
        }

        return prisma.profile.update({
          where: { id: args.id },
          data: dto,
        });
      },
    },

    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDScalar) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (_src, args, { prisma }) =>
        prisma.user.update({
          where: { id: args.id },
          data: args.dto,
        }),
    },

    // followers
    subscribeTo: {

      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDScalar) },
        authorId: { type: new GraphQLNonNull(UUIDScalar) },
      },
      resolve: async (_src, args, { prisma }) => {
        await prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: args.userId,
            authorId: args.authorId,
          },
        });

        return 'SUBSCRIBED';
      },
    },

    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDScalar) },
        authorId: { type: new GraphQLNonNull(UUIDScalar) },
      },
      resolve: async (_src, args, { prisma }) => {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: args.userId,
              authorId: args.authorId,
            },
          },
        });

        return 'UNSUBSCRIBED';
      },
    }


  })
});

export const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: Mutations,
});
