import { UAParser } from 'ua-parser-js';

export function isMobileDevice(req) {
  if (typeof navigator !== 'undefined') {
    const parser = new UAParser();
    const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
    const result = parser.setUA(userAgent).getResult();
    return result.device && result.device.type === 'mobile';
  }
}
