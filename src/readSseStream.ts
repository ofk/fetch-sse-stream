import { getSseStreamChunks } from './getSseStreamChunks';

type ReadSseStreamOptions = NonNullable<Parameters<typeof getSseStreamChunks>[1]> & {
  isDone?: (data: string) => boolean;
  onData?: (data: string) => void;
};

export async function readSseStream(
  stream: unknown,
  { isDone, onData, ...options }: ReadSseStreamOptions = {},
): Promise<void> {
  // eslint-disable-next-line no-restricted-syntax
  for await (const value of getSseStreamChunks(stream, options)) {
    if (isDone?.(value.data)) {
      break;
    }
    onData?.(value.data);
  }
}
