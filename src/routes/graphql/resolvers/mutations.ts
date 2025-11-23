import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
} from 'graphql';

import { PrismaClient } from '@prisma/client';

import { UserType, ProfileType, PostType } from '../types/index.js';
import { UUIDScalar } from '../scalars.js';
import {
    CreateUserInput,
    CreatePostInput,
    CreateProfileInput,
    ChangePostInput,
    ChangeProfileInput,
    ChangeUserInput,
} from '../inputs.js';

type GqlContext = {
    prisma: PrismaClient;
};

export const Mutations = new GraphQLObjectType<GqlContext>({
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
        },

    }),
});