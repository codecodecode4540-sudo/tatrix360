import { factories } from '@strapi/instance';
export default factories.createCoreRouter('api::menu-item.menu-item', { config: { find: { auth: false }, findOne: { auth: false } } });
