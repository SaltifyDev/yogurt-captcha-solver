/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
interface Window {
  TencentCaptcha: any;
  captchaCallback: (res: any) => void;
  ajax: (url: string, method: string, para: any, cb: Function, type?: any) => XMLHttpRequest;
  getQueryParam: (param: string) => string | null;
  reportError: (errorType: string, errorMessage?: string) => void;
  loadErrorCallback: () => void;
  loadScript: (src: string, callback: () => void, err: (ev: ErrorEvent | string) => void) => void;
  initCaptcha: () => void;
  oldPcCallNative?: (t: string, e?: any) => void;
  mqq?: any;
}
