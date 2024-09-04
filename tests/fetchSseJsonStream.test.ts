import nock from 'nock';
import { Readable } from 'node:stream';

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
  test('succeed', async () => {
    nock('https://example.com').get('/').reply(200, createMockStream);
    const result: string[] = [];
    await expect(
      fetchSseJsonStream<{ k: string }>('https://example.com/', {
        onData(data) {
          result.push(data.k);
        },
      }),
    ).resolves.toBeUndefined();
    expect(result).toEqual(['foo', 'bar', 'baz']);
  });

  test('for coverage', async () => {
    nock('https://example.com').post('/').reply(200, createMockStream);
    await expect(
      fetchSseJsonStream('https://example.com/', { body: {}, method: 'POST' }),
    ).resolves.toBeUndefined();
  });
});
