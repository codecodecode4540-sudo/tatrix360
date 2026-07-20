import { factories } from '@strapi/instance';
export default factories.createCoreRouter('api::tag.tag', { config: { find: { auth: false }, findOne: { auth: false } } });
