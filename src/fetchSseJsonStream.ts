import { fetchSseStream } from './fetchSseStream';

type FetchSseStreamInit = NonNullable<Parameters<typeof fetchSseStream>[1]>;

type FetchSseJsonStreamInit<T> = Omit<FetchSseStreamInit, 'body' | 'onData'> & {
  body?: unknown;
  onData?: (data: T) => void;
};

export async function fetchSseJsonStream<T = unknown>(
  input: Parameters<typeof fetchSseStream>[0],
  { body, onData, ...init }: FetchSseJsonStreamInit<T> = {},
): Promise<void> {
  const req = new Request(input, init);
  const fetchSseStreamInit: FetchSseStreamInit = {};

  if (
    ![ReadableStream, Blob, ArrayBuffer, FormData].some((type) => body instanceof type) &&
    !req.headers.has('Content-Type')
  ) {
    req.headers.set('Content-Type', 'application/json');
    if (body !== undefined) {
      fetchSseStreamInit.body = JSON.stringify(body);
    }
  } else {
    fetchSseStreamInit.body = body as FetchSseStreamInit['body'];
  }
  if (onData) {
    fetchSseStreamInit.onData = (data): void => {
      onData(JSON.parse(data) as T);
    };
  }
  await fetchSseStream(req, fetchSseStreamInit);
}
