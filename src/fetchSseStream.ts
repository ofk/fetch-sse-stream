import { fetchSafe } from './fetchSafe';
import { readSseStream } from './readSseStream';

type FetchSseStreamInit = NonNullable<Parameters<typeof readSseStream>[1]> & RequestInit;

export async function fetchSseStream(
  input: Parameters<typeof fetchSafe>[0],
  { isDone, onData, ...init }: FetchSseStreamInit = {},
): Promise<void> {
  const req = new Request(input, init);
  if (!req.headers.has('Accept')) {
    req.headers.set('Accept', 'text/event-stream');
  }
  const resp = await fetchSafe(req);
  await readSseStream(resp.body, { isDone, onData, signal: init.signal });
}
