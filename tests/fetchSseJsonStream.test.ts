import type { Body } from 'nock';

import nock from 'nock';
import { Readable } from 'node:stream';
import { describe, expect, it } from 'vitest';

import { fetchSseJsonStream } from '../src';

function createMockStream(count: number): Readable {
  const stream = new Readable();
  ['foo', 'bar', 'baz', 'qux', 'quux'].slice(0, count).forEach((k) => {
    stream.push(`data: ${JSON.stringify({ k })}\n\n`);
  });
  stream.push(null);
  return stream;
}

describe('fetchSseJsonStream', () => {
  it('succeeds', async () => {
    nock('https://example.com')
      .post('/')
      .reply(200, (_uri: string, body: Exclude<Body, string>) =>
        createMockStream(body.count as number),
      );

    const result: string[] = [];

    await expect(
      fetchSseJsonStream<{ k: string }>('https://example.com/', {
        body: {
          count: 3,
        },
        method: 'POST',
        onData(data) {
          result.push(data.k);
        },
      }),
    ).resolves.toBeUndefined();
    expect(result).toStrictEqual(['foo', 'bar', 'baz']);
  });

  it('is for coverage', async () => {
    nock('https://example.com')
      .get('/')
      .reply(200, () => createMockStream(1));

    await expect(fetchSseJsonStream('https://example.com/')).resolves.toBeUndefined();
  });
});
