import nock from 'nock';
import { describe, expect, it } from 'vitest';

import { fetchSafe } from '../src';

describe('fetchSafe', () => {
  it('succeeds', async () => {
    nock('https://example.com').get('/').reply(200, 'OK');

    const resp = await fetchSafe('https://example.com/');

    expect(resp.status).toBe(200);
    await expect(resp.text()).resolves.toBe('OK');
  });

  it('fails', async () => {
    nock('https://example.com').get('/').reply(404, 'Not Found');

    await expect(fetchSafe('https://example.com/')).rejects.toThrow('Not Found');
  });

  it('aborts', async () => {
    nock('https://example.com').get('/').delay(10000).reply(200, 'OK');

    const abortController = new AbortController();
    setTimeout(() => {
      abortController.abort();
    }, 0);

    await expect(
      fetchSafe('https://example.com/', {
        signal: abortController.signal,
      }),
    ).rejects.toThrow('This operation was aborted');

    nock.abortPendingRequests();
  });
});
