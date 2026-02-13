import { useEffect, useRef } from 'react';

interface CapVerifyResult {
  ret: 0;
  appid: string;
  randstr: string;
  ticket: string;
}

interface CaptchaContainerProps {
  onCompleteAction: (result: CapVerifyResult) => void;
}

export default function CaptchaContainer({ onCompleteAction }: CaptchaContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef<boolean>(false);

  useEffect(() => {
    const captchaContainer = document.createElement('div');
    captchaContainer.className = 'captcha-page';
    containerRef.current?.appendChild(captchaContainer);

    window.captchaCallback = (res: CapVerifyResult) => {
      onCompleteAction(res);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-function-type
    window.ajax = (url: string, method: string, para: any, cb: Function, type?: any) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
          if (
            (xhr.status >= 200 && xhr.status < 300) ||
            xhr.status === 304 ||
            xhr.status === 1223 ||
            xhr.status === 0
          ) {
            if (typeof type == 'undefined' && xhr.responseText) {
              cb(eval('(' + xhr.responseText + ')'));
            } else {
              cb(xhr.responseText);
            }
          }
        }
      };
      xhr.send(para);
      return xhr;
    };

    window.getQueryParam = (param: string) => {
      const url = window.location.href || '';
      const reg = new RegExp('[?&]' + param + '=([^&#]*)', 'i');
      const value = reg.exec(url);
      return value ? value[1] : null;
    };

    window.reportError = (errorType: string, errorMessage?: string) => {
      let urlStr = 'https://ti.qq.com/safe/tools/captcha/' + errorType;
      if (errorMessage) {
        urlStr = urlStr + '?m=' + encodeURIComponent(errorMessage);
      }
      window.ajax(urlStr, 'get', null, () => {});
    };

    window.loadErrorCallback = () => {
      const appid = '';
      const ticket = 'terror_1001_' + appid + '_' + Math.floor(new Date().getTime() / 1000);
      const result = {
        ret: 0,
        randstr: '@' + Math.random().toString(36).substr(2),
        ticket: ticket,
        errorCode: 1001,
        errorMessage: 'jsload_error',
      };
      console.log(result);
      window.captchaCallback(result);
    };

    window.loadScript = (src: string, callback: () => void, err: (ev: ErrorEvent | string) => void): void => {
      const tag = document.createElement('script');
      tag.onload = function (): void {
        callback();
        tag.onload = null;
        tag.parentNode?.removeChild(tag);
      };
      tag.onerror = err as OnErrorEventHandler;
      tag.src = src;

      document.head.appendChild(tag);
    };

    window.initCaptcha = () => {
      try {
        const uin = window.getQueryParam('uin');
        const sid = window.getQueryParam('sid');
        const aid = window.getQueryParam('aid');
        const loginAppId = window.getQueryParam('login_appid');
        const fromOldPC = window.getQueryParam('fromOldPc');
        const appid = aid || (fromOldPC ? '1' : '2081081773');

        const userAgent = window.navigator.userAgent;
        const options = {
          bizState: {
            uin: uin,
          },
          type: 'embed',
          showHeader: true,
          login_appid: loginAppId,
          uin: uin,
          sid: sid,
          enableAged: 'true',
          captchaWidth: 300,
        };

        console.log(options);

        if (userAgent.indexOf('CurrentMode/3') > -1) {
          options.enableAged = 'force';
        }

        const captcha = new window.TencentCaptcha(
          captchaContainer,
          appid,
          (res: unknown) => {
            try {
              window.captchaCallback(res);
            } catch {
              window.reportError('callbackError');
            }
          },
          options
        );

        captcha.show();
      } catch {
        window.reportError('initError');
        const appid = '2081081773';
        const res = {
          ret: 0,
          randstr: '@' + Math.random().toString(36).substring(2),
          ticket: 'terror_1001_' + appid + '_' + Math.floor(new Date().getTime() / 1000),
          errorCode: 1001,
          errorMessage: 'jsload_error',
        };
        window.captchaCallback(res);
      }
    };

    if (!scriptLoaded.current) {
      window.loadScript(
        'https://captcha.gtimg.com/TCaptcha.js',
        () => window.initCaptcha(),
        () => {
          window.reportError('jsLoadError');
          window.loadScript(
            'https://ssl.captcha.qq.com/TCaptcha.js',
            () => window.initCaptcha(),
            () => window.loadErrorCallback()
          );
        }
      );

      scriptLoaded.current = true;
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [onCompleteAction]);

  return <div ref={containerRef} className="w-full h-full" />;
}
