/* eslint-disable no-await-in-loop */
import type { EventSourceMessage } from 'eventsource-parser/stream';

import { EventSourceParserStream } from 'eventsource-parser/stream';

export async function* getSseStreamChunks(
  stream: unknown,
  { signal }: Pick<RequestInit, 'signal'> = {},
): AsyncGenerator<EventSourceMessage, void> {
  if (!(stream instanceof ReadableStream)) {
    throw new TypeError('The stream must be a ReadableStream.');
  }

  if (stream.locked) {
    throw new Error('The stream is locked right now. Please try again.');
  }

  const reader = stream
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream())
    .getReader();

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      reader.releaseLock();
      await stream.cancel();
      break;
    }

    if (signal?.aborted) {
      await reader.cancel('aborted');
      throw new DOMException('This operation was aborted', 'AbortError');
    }

    yield value;
  }
}
