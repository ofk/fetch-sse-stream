import { getSseStreamChunks } from './getSseStreamChunks';

export async function readSseStream(
  stream: unknown,
  { onData, signal }: Pick<RequestInit, 'signal'> & { onData?: (data: string) => void } = {},
): Promise<void> {
  // eslint-disable-next-line no-restricted-syntax
  for await (const value of getSseStreamChunks(stream, { signal })) {
    onData?.(value.data);
  }
}
