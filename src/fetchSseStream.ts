import { fetchSafe } from './fetchSafe';
import { readSseStream } from './readSseStream';

export async function fetchSseStream(
  input: Parameters<typeof fetchSafe>[0],
  { onData, ...init }: Parameters<typeof fetchSafe>[1] & Parameters<typeof readSseStream>[1] = {},
): Promise<void> {
  const req = new Request(input, init);
  if (!req.headers.has('Accept')) {
    req.headers.set('Accept', 'text/event-stream');
  }
  const resp = await fetchSafe(req);
  await readSseStream(resp.body, { onData, signal: init.signal });
}
