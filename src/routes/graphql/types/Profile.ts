import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLString,
} from 'graphql';
import { UUIDScalar } from '../scalars.js';
// import { MemberTypeType } from './MemberType.js';
// import { UserType } from './User.js';
import { UserType, MemberTypeType } from './types/index.js';

export const ProfileType = new GraphQLObjectType({

    name: 'Profile',
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDScalar) },
        isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
        yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },

        userId: { type: new GraphQLNonNull(UUIDScalar) },
        memberTypeId: { type: new GraphQLNonNull(GraphQLString) },

        user: { type: UserType },
        memberType: { type: MemberTypeType },
    }),

});