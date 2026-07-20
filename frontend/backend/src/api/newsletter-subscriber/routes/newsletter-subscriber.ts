import { factories } from '@strapi/instance';
export default factories.createCoreRouter('api::newsletter-subscriber.newsletter-subscriber', {
  config: { find: { auth: false }, findOne: { auth: false }, create: { auth: false } },
});
