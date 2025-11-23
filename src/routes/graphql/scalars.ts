import { GraphQLScalarType, Kind } from 'graphql';
import { validate as validateUuid } from 'uuid';

export const UUIDScalar = new GraphQLScalarType({

    name: 'UUID',
    description: 'UUID scalar type representing a valid UUID string',
    serialize(value: unknown) {

        const str = String(value);
        if (!validateUuid(str)) {
            throw new TypeError('Invalid UUID');
        }
        return str;
    },
    parseValue(value: unknown) {

        const str = String(value);
        if (!validateUuid(str)) {
            throw new TypeError('Invalid UUID');
        }
        return str;
    },
    parseLiteral(ast) {

        if (ast.kind === Kind.STRING && validateUuid(ast.value)) {
            return ast.value;
        }
        throw new TypeError('Invalid UUID literal');
    },
});