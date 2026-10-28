// Read literal copy without evaluating app code. Template expressions are code;
// their nested quoted literals are still visited. Comments and regexes are skipped.
export function copyLiterals(source) {
 const values=[];let i=0;
 function quoted(quote){const start=i++;let text='';while(i<source.length){const ch=source[i++];if(ch==='\\'){text+=ch+(source[i++]||'');continue;}if(ch===quote){values.push({text,start});return;}if(quote==='`'&&ch==='$'&&source[i]==='{'){values.push({text,start});text='';i++;code(true);continue;}text+=ch;} }
 function code(expression=false){let depth=0;while(i<source.length){const ch=source[i];
  if(ch==='"'||ch==="'"||ch==='`'){quoted(ch);continue;}
  if(source.slice(i,i+2)==='//'){i=source.indexOf('\n',i);if(i<0)i=source.length;continue;}
  if(source.slice(i,i+2)==='/*'){const end=source.indexOf('*/',i+2);i=end<0?source.length:end+2;continue;}
  if(ch==='/'&&/[=(,:;!?&|{}\[]/.test(source.slice(0,i).trimEnd().at(-1)||'')){i++;let bracket=false;while(i<source.length){const c=source[i++];if(c==='\\'){i++;continue;}if(c==='[')bracket=true;if(c===']')bracket=false;if(c==='/'&&!bracket)break;}while(/[a-z]/i.test(source[i]||'')&&i<source.length)i++;continue;}
  if(ch==='{')depth++;if(ch==='}'){if(expression&&depth===0){i++;return;}depth--;}
  i++;
 }}
 code();return values;
}
