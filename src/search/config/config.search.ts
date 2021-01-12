export class ConfigSearch {
  public static searchConfig(url: string): any {
    return {
      node: url,
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD,
      },
    };
  }
}
