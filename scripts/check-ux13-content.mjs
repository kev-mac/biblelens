import fs from 'node:fs';
import assert from 'node:assert/strict';
import {validateUX13Content} from './ux13-content.mjs';
import {assess} from './check-readability.mjs';
console.log('PASS:',validateUX13Content());
const summaries=Object.values(JSON.parse(fs.readFileSync('data/reference/place-summaries.json')));
for(const s of summaries){assert(!assess(s.summary.replace(/ \([^)]*\)$/,'')).tooLong,'Summary sentence limit: '+s.summary);}
const review=summaries.filter(s=>s.method==='needs-context-review').length;
console.log('Coverage and source integrity pass. Context drafts still needing a full why-mentioned summary:',review);
