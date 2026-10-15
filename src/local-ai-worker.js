import { WebWorkerMLCEngineHandler } from '@mlc-ai/web-llm';

// Official WebLLM worker protocol; downloading/reloading begins only when the
// caller explicitly invokes initialize() after the user enables the feature.
const handler = new WebWorkerMLCEngineHandler();
self.onmessage = event => handler.onmessage(event);
