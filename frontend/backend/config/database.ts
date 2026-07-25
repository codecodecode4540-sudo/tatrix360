export default ({ env }: { env: (name: string, defaultValue?: string) => string }) => ({
  connection: {
    client: 'sqlite',
    connection: { filename: env('DATABASE_FILENAME', '.tmp/data.db') },
    useNullAsDefault: true,
  },
});
