declare module '*.js' {
  const value: any;
  export default value;
}

declare module '../hooks/*' {
  const value: any;
  export default value;
}

declare module './api' {
  import { AxiosInstance } from 'axios';
  export const api: AxiosInstance;
  export const authAPI: any;
  export const menuAPI: any;
  export const ordersAPI: any;
  export const customersAPI: any;
  export const adminAPI: any;
  export const contactAPI: any;
  export default api;
}
