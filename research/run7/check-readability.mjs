import fs from 'node:fs';
import {report} from '../../scripts/check-readability.mjs';

// Research notes are disclosed detail prose. IDs, file paths, headings and
// copied audit fields are metadata, not newly authored interface text.
const prose = file => fs.readFileSync(new URL(file,import.meta.url),'utf8').split('\n')
  .filter(line=>line.trim() && !line.startsWith('#'))
  .map(line=>line.replace(/`[^`]+`/g,'').replace(/^\s*(?:- |\d+\. )/,''));
const data=JSON.parse(fs.readFileSync(new URL('label-proposals.json',import.meta.url),'utf8'));
const failed=report([
  {name:'Run 7 rubric',tier:'detail',lines:prose('evidence-tier-rubric.md')},
  {name:'Run 7 review notes',tier:'detail',lines:prose('README.md')},
  {name:'Run 7 label reasons',tier:'detail',lines:[...new Set(data.records.map(row=>row.label_reason))]},
]);
if(failed)process.exitCode=1;
