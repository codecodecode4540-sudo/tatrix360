import { factories } from '@strapi/instance';
export default factories.createCoreRouter('api::post.post', { config: { find: { auth: false }, findOne: { auth: false } } });
