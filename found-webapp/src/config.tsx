interface IConfig {
    API_BASE_PATH: string
}

const LocalConfig: IConfig = {
    API_BASE_PATH: 'http://localhost:8000/api/v2'
} 

const ProdConfig: IConfig = {
    API_BASE_PATH: '...'
} 

let configToExport: IConfig;

switch(process.env.VITE_APP_ENVIRONMENT) {
    case "PROD":
        configToExport = ProdConfig;
        break;
    default:
        configToExport = LocalConfig;
}

export default configToExport;
