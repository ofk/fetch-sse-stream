import nock from 'nock';

import { fetchSafe } from '../src';

describe('fetchSafe', () => {
  test('succeed', async () => {
    nock('https://example.com').get('/').reply(200, 'OK');
    const resp = await fetchSafe('https://example.com/');
    expect(resp.status).toBe(200);
    await expect(resp.text()).resolves.toBe('OK');
  });

  test('failed', async () => {
    nock('https://example.com').get('/').reply(404, 'Not Found');
    await expect(fetchSafe('https://example.com/')).rejects.toThrow('Not Found');
  });

  test('aborted', async () => {
    nock('https://example.com').get('/').delayBody(10000).reply(200, 'OK');
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
