type Env = {
  (name: string, defaultValue?: string): string;
  int: (name: string, defaultValue?: number) => number;
  bool: (name: string, defaultValue?: boolean) => boolean;
  array: (name: string, defaultValue?: string[]) => string[];
};

export default ({ env }: { env: Env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: { keys: env.array('APP_KEYS', ['key1', 'key2', 'key3', 'key4']) },
  webhooks: { populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false) },
  url: env('PUBLIC_URL', 'http://localhost:1337'),
});
