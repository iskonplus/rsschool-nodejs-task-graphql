import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLFloat,
    GraphQLString,
    GraphQLList,
} from 'graphql';
import { UUIDScalar } from '../scalars.js';
import { ProfileType } from './Profile.js';
import { PostType } from './Post.js';
import { MemberTypeType } from './MemberType.js';

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDScalar) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        balance: { type: new GraphQLNonNull(GraphQLFloat) },

        profile: { type: ProfileType },
        posts: { type: new GraphQLList(PostType) },
        memberType: { type: MemberTypeType },

        userSubscribedTo: {
            type: new GraphQLList(UserType),
            resolve(source: any) {
                if (!source.userSubscribedTo) {
                    return [];
                }
                return source.userSubscribedTo.map((link: any) => link.author);
            },
        },

        subscribedToUser: {
            type: new GraphQLList(UserType),
            resolve(source: any) {
                if (!source.subscribedToUser) {
                    return [];
                }
                return source.subscribedToUser.map((link: any) => link.subscriber);
            },
        },
    }),
});