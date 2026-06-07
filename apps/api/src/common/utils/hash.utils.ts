import * as crypto from 'crypto';
import stringify from 'fast-json-stable-stringify';

export function hash(input: unknown): string {
  return crypto.createHash('sha256').update(stringify(input)).digest('hex');
}
