const isProduction = process.env.NODE_ENV === "production";

interface Config {
  API_URL: string;
  FOUND_QR_PATH: string;
}

const config_development: Config = {
  API_URL: 'http://192.168.0.140:8000/api/v2',
  FOUND_QR_PATH: 'http://localhost:4000?qr='
};

const config_production: Config = {
  API_URL: 'https://api.puppysignal.com/api/v2',
  FOUND_QR_PATH: 'https://app.puppysignal.com?qr='
}

Object.freeze(config_development);
Object.freeze(config_production);

export default isProduction ? config_production : config_development;