import nock from 'nock';
import { Readable } from 'node:stream';
import { describe, expect, it } from 'vitest';

import { fetchSafe, getSseStreamChunks } from '../src';

function createMockStream(): Readable {
  const stream = new Readable();
  ['foo', 'bar', 'baz'].forEach((k) => {
    stream.push(`data: ${k}\n\n`);
  });
  stream.push(null);
  return stream;
}

describe('getSseStreamChunks', () => {
  it('succeeds', async () => {
    nock('https://example.com').get('/').reply(200, createMockStream);

    const resp = await fetchSafe('https://example.com/');
    const result: string[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const value of getSseStreamChunks(resp.body)) {
      result.push(value.data);
    }

    expect(result).toStrictEqual(['foo', 'bar', 'baz']);
  });

  it('is locked', async () => {
    nock('https://example.com').get('/').reply(200, createMockStream);

    const resp = await fetchSafe('https://example.com/');

    await expect(getSseStreamChunks(resp.body).next()).resolves.toBeTruthy();
    await expect(getSseStreamChunks(resp.body).next()).rejects.toThrow('The stream is locked');
  });
});
