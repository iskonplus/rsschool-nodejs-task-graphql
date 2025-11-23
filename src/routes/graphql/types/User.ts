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

        userSubscribedTo: { type: new GraphQLList(UserType) },
        subscribedToUser: { type: new GraphQLList(UserType) },
    }),

});