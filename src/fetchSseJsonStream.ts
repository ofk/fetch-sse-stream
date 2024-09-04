import { fetchSseStream } from './fetchSseStream';

type FetchSseJsonStreamInit<T> = {
  body?: boolean | number | object | string | null;
  onData?: (data: T) => void;
} & Omit<NonNullable<Parameters<typeof fetchSseStream>[1]>, 'body' | 'onData'>;

export async function fetchSseJsonStream<T = unknown>(
  input: Parameters<typeof fetchSseStream>[0],
  { body, onData, ...init }: FetchSseJsonStreamInit<T> = {},
): Promise<void> {
  const req = new Request(input, init);
  if (!req.headers.has('Content-Type')) {
    req.headers.set('Content-Type', 'application/json');
  }
  await fetchSseStream(req, {
    body: body ? JSON.stringify(body) : undefined,
    onData(data) {
      onData?.(JSON.parse(data) as T);
    },
  });
}
