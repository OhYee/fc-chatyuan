export const getEndpoint = () =>
  (window as any)?.['ENDPOINT'] || 'http://127.0.0.1:9000';
