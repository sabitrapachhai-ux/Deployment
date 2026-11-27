import crypto from 'node:crypto';

export default function generateTrackingCode() {
  return `RS-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}
