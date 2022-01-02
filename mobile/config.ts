const isProduction = process.env.NODE_ENV === "production";

interface Config {
  API_URL: string;
}

const config_development: Config = {
  API_URL: 'http://192.168.0.140/api/v2'
};

const config_production: Config = {
  API_URL: 'https://api.puppysignal.com/api/v2'
}

Object.freeze(config_development);
Object.freeze(config_production);

export default isProduction ? config_production : config_development;