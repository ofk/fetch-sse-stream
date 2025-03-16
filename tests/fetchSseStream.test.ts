import nock from 'nock';
import { Readable } from 'node:stream';
import { describe, expect, it } from 'vitest';

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
  it('succeed', async () => {
    nock('https://example.com').get('/').reply(200, createMockStream);
    const result: string[] = [];

    await expect(
      fetchSseStream('https://example.com/', {
        onData(data) {
          result.push(data);
        },
      }),
    ).resolves.toBeUndefined();
    expect(result).toStrictEqual(['foo', 'bar', 'baz']);
  });

  it('for coverage', async () => {
    nock('https://example.com').get('/').reply(200, createMockStream);

    await expect(fetchSseStream('https://example.com/')).resolves.toBeUndefined();
  });

  it('aborted', async () => {
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
    expect(result).toStrictEqual(['foo']);
  });

  it('invalid', async () => {
    nock('https://example.com').get('/').reply(204);

    await expect(fetchSseStream('https://example.com/')).rejects.toThrow(
      'The stream must be a ReadableStream.',
    );
  });
});
