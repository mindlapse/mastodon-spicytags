import { getJsonSecret } from "./lib/aws/ssm/ssm";

export type ConfigType = { [key: string]: string };

let config: Config;

const KEY_DATABASE_URL = "DATABASE_URL";
const KEY_REDIS_URL = "REDIS_URL";

const KEY_HOME_ACCOUNT_ID = "HOME_ACCOUNT_ID";
const KEY_HOME_API_URL = "HOME_API_URL";
const KEY_HOME_API_KEY = "HOME_API_KEY";

const KEY_SCAN_API_URL = "SCAN_API_URL";
const KEY_SCAN_API_KEY = "SCAN_API_KEY";

export default class Config {
  config: ConfigType;

  private constructor(config?: any) {
    if (config) {
      this.config = config;
    } else {
      throw new Error("Undefined config");
    }
  }

  getAccountId() {
    return this.config[KEY_HOME_ACCOUNT_ID];
  }

  getHomeApiUrl() {
    return this.config[KEY_HOME_API_URL];
  }

  getHomeApiKey() {
    return this.config[KEY_HOME_API_KEY];
  }

  getScanApiUrl() {
    return this.config[KEY_SCAN_API_URL];
  }

  getScanApiKey() {
    return this.config[KEY_SCAN_API_KEY];
  }

  getDatabaseUrl() {
    return this.config[KEY_DATABASE_URL];
  }

  getRedisUrl() {
    return this.config[KEY_REDIS_URL];
  }

  static get = async () => {
    if (!config) {
      try {
        // fetches `/${env.PRODUCT}/${env.ENV}/config`
        config = new Config(await getJsonSecret("config"));
      } catch (e) {
        console.error("Error loading config", e);
        throw e;
      }
    }
    return config;
  };
}
