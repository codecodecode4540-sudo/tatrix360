import { factories } from '@strapi/instance';
export default factories.createCoreRouter('api::contact-submission.contact-submission', {
  config: { find: { auth: false }, findOne: { auth: false }, create: { auth: false } },
});
