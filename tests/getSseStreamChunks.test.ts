import nock from 'nock';
import { Readable } from 'node:stream';

import { fetchSafe, getSseStreamChunks } from '../src';

function createMockStream(): Readable {
  const stream = new Readable();
  stream.push('data: foo\n\n');
  stream.push('data: bar\n\n');
  stream.push('data: baz\n\n');
  stream.push(null);
  return stream;
}

describe('getSseStreamChunks', () => {
  test('succeed', async () => {
    nock('https://example.com').get('/').reply(200, createMockStream);
    const resp = await fetchSafe('https://example.com/');
    const result: string[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for await (const value of getSseStreamChunks(resp.body)) {
      result.push(value.data);
    }
    expect(result).toEqual(['foo', 'bar', 'baz']);
  });

  test('locked', async () => {
    nock('https://example.com').get('/').reply(200, createMockStream);
    const resp = await fetchSafe('https://example.com/');
    await expect(getSseStreamChunks(resp.body).next()).resolves.toBeTruthy();
    await expect(getSseStreamChunks(resp.body).next()).rejects.toThrow('The stream is locked');
  });
});
