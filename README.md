# fetch-sse-stream

A library for Server-Sent Events, like fetch.

## Usage

```js
import { fetchSseJsonStream } from 'fetch-sse-stream';

fetchSseJsonStream('https://api.openai.com/...', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer <token>',
  },
  body: {
    stream: true,
    // ...
  },
  onData(data) {
    console.log(data);
  },
});
```
