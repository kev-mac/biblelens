import {createChapterLoader} from '../src/chapter-cache.js';

// Exercise the production loader in isolated classic-script tests.
export function installChapterFixture(context, {abort = true} = {}) {
 context.setTimeout ||= setTimeout;
 context.clearTimeout ||= clearTimeout;
 if (abort) context.AbortController ||= AbortController;
 context.window ||= {};
 return context.window.BibleLensChapters = createChapterLoader(context);
}
