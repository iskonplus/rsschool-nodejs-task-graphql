import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLFloat,
    GraphQLInt,
    GraphQLString,
} from 'graphql';

export const MemberTypeType = new GraphQLObjectType({

    name: 'MemberType',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLString) },
        discount: { type: new GraphQLNonNull(GraphQLFloat) },
        postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
    }),

});