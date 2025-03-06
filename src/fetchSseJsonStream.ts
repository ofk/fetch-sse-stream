import { fetchSseStream } from './fetchSseStream';

type FetchSseStreamInit = NonNullable<Parameters<typeof fetchSseStream>[1]>;

type FetchSseJsonStreamInit<T> = Omit<FetchSseStreamInit, 'body' | 'onData'> & {
  body?: boolean | number | object | string | null;
  onData?: (data: T) => void;
};

export async function fetchSseJsonStream<T = unknown>(
  input: Parameters<typeof fetchSseStream>[0],
  { body, onData, ...init }: FetchSseJsonStreamInit<T> = {},
): Promise<void> {
  const req = new Request(input, init);
  if (!req.headers.has('Content-Type')) {
    req.headers.set('Content-Type', 'application/json');
  }
  const fetchSseStreamInit: FetchSseStreamInit = {};
  if (body !== undefined) {
    fetchSseStreamInit.body = JSON.stringify(body);
  }
  if (onData) {
    fetchSseStreamInit.onData = (data): void => {
      onData(JSON.parse(data) as T);
    };
  }
  await fetchSseStream(req, fetchSseStreamInit);
}
