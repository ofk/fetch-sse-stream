import nock from 'nock';
import { Readable } from 'node:stream';
import { describe, expect, it } from 'vitest';

import { fetchSseJsonStream } from '../src';

function createMockStream(): Readable {
  const stream = new Readable();
  stream.push('data: {"k":"foo"}\n\n');
  stream.push('data: {"k":"bar"}\n\n');
  stream.push('data: {"k":"baz"}\n\n');
  stream.push(null);
  return stream;
}

describe('fetchSseJsonStream', () => {
  it('succeed', async () => {
    nock('https://example.com').get('/').reply(200, createMockStream);
    const result: string[] = [];

    await expect(
      fetchSseJsonStream<{ k: string }>('https://example.com/', {
        onData(data) {
          result.push(data.k);
        },
      }),
    ).resolves.toBeUndefined();
    expect(result).toStrictEqual(['foo', 'bar', 'baz']);
  });

  it('for coverage', async () => {
    nock('https://example.com').post('/').reply(200, createMockStream);

    await expect(
      fetchSseJsonStream('https://example.com/', { body: {}, method: 'POST' }),
    ).resolves.toBeUndefined();
  });
});
