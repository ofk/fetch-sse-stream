# fetch-sse-stream

[![npm](https://img.shields.io/npm/v/fetch-sse-stream)](https://npmjs.com/package/fetch-sse-stream)
![ci](https://github.com/ofk/fetch-sse-stream/actions/workflows/ci.yml/badge.svg)

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
