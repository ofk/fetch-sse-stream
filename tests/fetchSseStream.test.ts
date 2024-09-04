import nock from 'nock';
import { Readable } from 'node:stream';

import { fetchSseStream } from '../src';

function createMockStream(): Readable {
  const stream = new Readable();
  stream.push('data: foo\n\n');
  stream.push('data: bar\n\n');
  stream.push('data: baz\n\n');
  stream.push(null);
  return stream;
}

describe('fetchSseStream', () => {
  test('succeed', async () => {
    nock('https://example.com').get('/').reply(200, createMockStream);
    const result: string[] = [];
    await expect(
      fetchSseStream('https://example.com/', {
        onData(data) {
          result.push(data);
        },
      }),
    ).resolves.toBeUndefined();
    expect(result).toEqual(['foo', 'bar', 'baz']);
  });

  test('for coverage', async () => {
    nock('https://example.com').get('/').reply(200, createMockStream);
    await expect(fetchSseStream('https://example.com/')).resolves.toBeUndefined();
  });

  test('aborted', async () => {
    nock('https://example.com').get('/').reply(200, createMockStream);
    const abortController = new AbortController();
    const result: string[] = [];
    await expect(
      fetchSseStream('https://example.com/', {
        onData(data) {
          abortController.abort();
          result.push(data);
        },
        signal: abortController.signal,
      }),
    ).rejects.toThrow('This operation was aborted');
    expect(result).toEqual(['foo']);
  });
});
