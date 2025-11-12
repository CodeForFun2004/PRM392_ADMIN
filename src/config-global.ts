import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  apiUrl: string;
};

export const CONFIG: ConfigValue = {
  appName: 'Chill Cup',
  appVersion: packageJson.version,
  apiUrl: 'http://localhost:3000',
};
