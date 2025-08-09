import nock from 'nock';
import { Readable } from 'node:stream';
import { describe, expect, it } from 'vitest';

import { fetchSseStream } from '../src';

function createMockStream(): Readable {
  const stream = new Readable();
  ['foo', 'bar', 'baz'].forEach((k) => {
    stream.push(`data: ${k}\n\n`);
  });
  stream.push(null);
  return stream;
}

describe('fetchSseStream', () => {
  it('succeeds', async () => {
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

  it('withdraws', async () => {
    nock('https://example.com').get('/').reply(200, createMockStream);

    const result: string[] = [];

    await expect(
      fetchSseStream('https://example.com/', {
        isDone: (data) => data === 'bar',
        onData(data) {
          result.push(data);
        },
      }),
    ).resolves.toBeUndefined();
    expect(result).toStrictEqual(['foo']);
  });

  it('is for coverage', async () => {
    nock('https://example.com').get('/').reply(200, createMockStream);

    await expect(fetchSseStream('https://example.com/')).resolves.toBeUndefined();
  });

  it('throws', async () => {
    nock('https://example.com').get('/').reply(200, createMockStream);

    const result: string[] = [];

    await expect(
      fetchSseStream('https://example.com/', {
        onData(data) {
          if (data === 'bar') {
            throw new Error('stop');
          }
          result.push(data);
        },
      }),
    ).rejects.toThrow('stop');
    expect(result).toStrictEqual(['foo']);
  });

  it('aborts', async () => {
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

  it('is invalid', async () => {
    nock('https://example.com').get('/').reply(204);

    await expect(fetchSseStream('https://example.com/')).rejects.toThrow(
      'The stream must be a ReadableStream.',
    );
  });
});
