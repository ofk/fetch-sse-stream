import { fetchSafe } from './fetchSafe';
import { getSseStreamChunks } from './getSseStreamChunks';

export async function fetchSseStream(
  input: Parameters<typeof fetchSafe>[0],
  { onData, ...init }: Parameters<typeof fetchSafe>[1] & { onData?: (data: string) => void } = {},
): Promise<void> {
  const req = new Request(input, init);
  if (!req.headers.has('Accept')) {
    req.headers.set('Accept', 'text/event-stream');
  }
  const resp = await fetchSafe(req);
  // eslint-disable-next-line no-restricted-syntax
  for await (const value of getSseStreamChunks(resp.body, { signal: init.signal })) {
    onData?.(value.data);
  }
}
