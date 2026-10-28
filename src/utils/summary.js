// JSON lines keep text chunks, completion, and errors distinct even when the
// network splits an event (or a UTF-8 character) across multiple reads.
export async function readStream(body, onChunk) {
  if (!body) throw new Error('Streaming response unavailable');
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let completed = false;

  const handleEvent = (line) => {
    if (!line.trim()) return;
    const event = JSON.parse(line);
    if (event.type === 'error') {
      const error = new Error('Summary generation failed');
      error.status = event.status;
      throw error;
    }
    if (event.type === 'chunk') onChunk(event.text);
    if (event.type === 'done') completed = true;
  };

  try {
    while (!completed) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      let newline;
      while (!completed && (newline = buffer.indexOf('\n')) !== -1) {
        handleEvent(buffer.slice(0, newline));
        buffer = buffer.slice(newline + 1);
      }
      if (done) {
        if (!completed && buffer.trim()) handleEvent(buffer);
        if (!completed) throw new Error('Summary stream interrupted');
        break;
      }
    }
  } finally {
    try {
      await reader.cancel();
    } finally {
      reader.releaseLock();
    }
  }
}

export function createResponse(res) {
  const controller = new AbortController();
  const { signal } = controller;
  const onClose = () => {
    if (!res.writableEnded) controller.abort();
  };
  res.once('close', onClose);

  const send = (event) => {
    signal.throwIfAborted();
    if (!res.headersSent) {
      res.status(200);
      res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('X-Accel-Buffering', 'no');
    }
    res.write(`${JSON.stringify(event)}\n`);
    res.flush?.();
  };

  return {
    signal,
    async writeChunks(chunks) {
      let hasContent = false;
      for await (const chunk of chunks) {
        if (chunk.text) {
          send({ type: 'chunk', text: chunk.text });
          hasContent = true;
        }
      }
      signal.throwIfAborted();
      if (!hasContent) throw new Error('Empty AI response');
    },
    complete() {
      send({ type: 'done' });
      res.end();
    },
    reject(err) {
      if (signal.aborted) return;
      console.error('Summary failed:', err.message);
      const status =
        Number.isInteger(err.status) && err.status >= 400 && err.status < 600
          ? err.status
          : 500;
      if (res.headersSent) {
        send({ type: 'error', status });
        res.end();
      } else {
        res.status(status).send('AI request failed');
      }
    },
    dispose() {
      res.off('close', onClose);
    },
  };
}
