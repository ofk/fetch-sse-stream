/* eslint-disable no-await-in-loop */
import type { ParsedEvent } from 'eventsource-parser';

import { EventSourceParserStream } from 'eventsource-parser/stream';

export async function* getSseStreamChunks(
  stream: ReadableStream<Uint8Array> | null,
  { signal }: Pick<RequestInit, 'signal'> = {},
): AsyncGenerator<ParsedEvent, void> {
  if (stream) {
    if (stream.locked) {
      throw new Error('Sorry! The stream is locked right now. Please try again.');
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
}
