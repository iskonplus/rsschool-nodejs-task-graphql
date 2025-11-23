import {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
} from 'graphql';
import { UUIDScalar } from '../scalars.js';
import { UserType } from './types/index.js';

export const PostType = new GraphQLObjectType({

    name: 'Post',
    fields: () => ({
        id: { type: new GraphQLNonNull(UUIDScalar) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(UUIDScalar) },

        author: { type: UserType },
    }),
    
});