import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLList,
} from 'graphql';

import { PrismaClient, Post, MemberType, Profile } from '@prisma/client';

import {
    UserType,
    ProfileType,
    PostType,
    MemberTypeType,
} from '../types/index.js';
import { MemberTypeId, UUIDScalar } from '../scalars.js';

type GqlContext = {
    prisma: PrismaClient;
};

export const RootQueryType = new GraphQLObjectType<GqlContext>({
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

        // get post by id
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

        // get memberTypes
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

        // get memberType by id
        memberType: {
            type: MemberTypeType,
            args: {
                id: { type: new GraphQLNonNull(MemberTypeId) },
            },
            async resolve(_src, args, context: GqlContext) {
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