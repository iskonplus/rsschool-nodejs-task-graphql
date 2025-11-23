import { FastifyPluginAsync } from 'fastify';

export { UserType } from './User.js';
export { ProfileType } from './Profile.js';
export { PostType } from './Post.js';
export { MemberTypeType } from './MemberType.js';

const plugin: FastifyPluginAsync = async () => {
};

export default plugin;