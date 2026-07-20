import { factories } from '@strapi/instance';
export default factories.createCoreRouter('api::category.category', { config: { find: { auth: false }, findOne: { auth: false } } });
