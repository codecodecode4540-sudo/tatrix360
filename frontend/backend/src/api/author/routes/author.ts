import { factories } from '@strapi/instance';
export default factories.createCoreRouter('api::author.author', { config: { find: { auth: false }, findOne: { auth: false } } });
