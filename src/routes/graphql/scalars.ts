import { GraphQLScalarType, Kind } from 'graphql';

const uuidRegExp =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const UUIDScalar = new GraphQLScalarType({
  name: 'UUID',
  description: 'UUID scalar type representing a valid UUID string',
  serialize(value: unknown) {
    const str = String(value);
    if (!uuidRegExp.test(str)) {
      throw new TypeError('Invalid UUID');
    }
    return str;
  },
  parseValue(value: unknown) {
    const str = String(value);
    if (!uuidRegExp.test(str)) {
      throw new TypeError('Invalid UUID');
    }
    return str;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING && uuidRegExp.test(ast.value)) {
      return ast.value;
    }
    throw new TypeError('Invalid UUID literal');
  },
});


export const MemberTypeId = new GraphQLScalarType({
  name: 'MemberTypeId',
  description:
    'Member type identifier (e.g. BASIC, BUSINESS, PREMIUM). Treated as string.',
  serialize(value: unknown) {
    return String(value);
  },
  parseValue(value: unknown) {
    return String(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }
    return null;
  },
});