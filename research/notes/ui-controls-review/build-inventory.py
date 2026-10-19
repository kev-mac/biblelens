import json,re,html,csv,collections
from pathlib import Path
p=Path(__file__).parent
variants=json.loads((p/'variants.json').read_text())
def esc(v):return html.escape(str(v))
def group(v):
 s=(v['selector']+' '+v['classes']).lower();tag=v['tag']
 if any(x in s for x in ['search','chat-input','chat-form','evidence-query']):return 'Search / question entry'
 if any(x in s for x in ['summary','inspect','timeline-history','citations-disclosure'] )or tag=='SUMMARY':return 'Expand / inspect'
 if any(x in s for x in ['story-theme','story-chip','relative-chip','character-badge','location-chip']):return 'Related topic / person / place'
 if any(x in s for x in ['passage','citation','verse-link','verse-citation']):
  if any(x in s for x in ['picker','number','steps','testament']):return 'Value picker'
  return 'Passage / citation'
 if any(x in s for x in ['facet','prophecy-toggle','characters-women','filter','marked-kind']):return 'Filter / reset'
 if tag=='SELECT' or 'reader-font' in s:return 'Dropdown / slider'
 if any(x in s for x in ['tab','reader-compare','theme']):return 'Tabs / toggles'
 if any(x in s for x in ['header','navigation','brand','close','chat-send','chapter-round']):return 'Navigation / icon action'
 return 'Other action'
for v in variants:v['group']=group(v)
# Preserve distinct computed appearances; merge duplicates from separate audit passes.
groups={}
for v in variants:
 family=v['classes'] or v['elementId'] or re.sub(r':nth-of-type\(\d+\)','',v['selector'])
 k=(v['group'],v['theme'],v['width'],v['tag'],family,v['radius'],round(v['height'],1),v['font'],v['fill'],v['gradient'],v['border'],v['ink'],v['pressed'],v['disabled'])
 if k not in groups:groups[k]={**v,'ids':[v['id']]}
 else:groups[k]['occurrences']+=v['occurrences'];groups[k]['ids'].append(v['id'])
rows=list(groups.values())
body=[]
with (p/'inventory.csv').open('w')as f:
 w=csv.writer(f);w.writerow(['Group','Variant IDs','Observed pages/states','Theme','Viewport width','Selector','Radius','Height','Width','Text px','Fill','Gradient','Border','Text color','Icon','Pressed','Disabled','Screenshot','Matching source selectors and lines'])
 for v in rows:
  places=sorted(set(o['page']for o in v['occurrences']));sources=[f"{r['file']}:{r['line']} {r['selector']}"for r in v.get('rules',[])];unique=len(set((o['page'],o['selector'])for o in v['occurrences']))
  w.writerow([v['group'],', '.join(v['ids']),', '.join(places),v['theme'],v['width'],v['selector'],v['radius'],v['height'],v.get('elementWidth'),v['font'],v['fill'],v['gradient'],v['border'],v['ink'],v['icon'],v['pressed'],v['disabled'],v['screenshot'],' | '.join(sources)])
  # 'width' in the raw variant is viewport width; actual element width is in each per-state controls record.
  warning=[]
  if v['height']<44 or (v.get('elementWidth') is not None and v['elementWidth']<44):warning.append('Target <44')
  if float(v['font'].replace('px',''))<12:warning.append('Text <12')
  if v.get('contrastKind')=='flat-fill calculation'and v.get('contrast',10)<4.5 and not v['disabled']:warning.append('Flat text contrast <4.5')
  detail=''.join('<li><code>'+esc(r['file'])+':'+str(r['line'])+' '+esc(r['selector'])+'</code><br>'+esc('; '.join(a['name']+': '+a['value']+(' !important'if a['important']else'')for a in r['properties']))+'</li>'for r in v.get('rules',[]))
  imagepath=v['screenshot'];exists=(p/imagepath).exists()
  body.append(f'''<tr data-theme="{v['theme']}" data-width="{v['width']}"><td><b>{esc(v['group'])}</b><br>{esc(', '.join(v['ids']))}<br>{esc(', '.join(places))}<br>{unique} recorded placements*</td><td>{v['theme']}<br>{v['width']}px</td><td><a href="{imagepath}"><img loading="lazy" src="{imagepath}" alt="{esc(v['label'])}"></a><br>{esc(v['label'])}<br>{esc(v['pressed'])} / disabled: {v['disabled']}</td><td>r {esc(v['radius'])}<br>h {v['height']:.1f}px × w {v.get('elementWidth',0):.1f}px<br>text {esc(v['font'])}<br>icon {esc(v['icon'])}</td><td><code>fill {esc(v['fill'])}<br>border {esc(v['border'])}<br>text {esc(v['ink'])}</code><details><summary>Gradient</summary><code>{esc(v['gradient'])}</code></details></td><td>{esc(', '.join(warning))}<br>{esc(v.get('contrast',''))}:1<br>{esc(v.get('contrastKind',''))}</td><td><code>{esc(v['selector'])}</code><details><summary>{len(sources)} matching source rules</summary><ol>{detail}</ol></details></td></tr>''')
# Source/measurement limitations and summary counts.
counts=collections.Counter(v['group']for v in rows)
intro=''.join(f'<li>{esc(g)}: {n} appearance records</li>'for g,n in sorted(counts.items()))
pages=[]
allstates=[]
for name in ['measurements.json','supplemental.json','targeted.json','profiles.json']:
 x=json.loads((p/name).read_text());allstates+=x['results']
for r in allstates:pages.append(f'<li><a href="{r["screenshot"]}">{esc(r["page"])} — {r["theme"]}, {r["width"]}px</a> ({len(r["controls"])} controls/elements recorded)</li>')
text=f'''<!doctype html><html lang="en"><meta charset="utf-8"><title>BibleLens control inventory</title><style>body{{font:14px/1.5 system-ui;margin:24px;color:#203040;background:#fafcff}}h1{{font-size:24px}}table{{border-collapse:collapse;width:100%}}td,th{{border:1px solid #ccd5df;padding:10px;vertical-align:top;text-align:left}}th{{position:sticky;top:0;background:#e9eff6}}td img{{max-width:200px;max-height:90px;background:#172232}}code{{font:11px/1.45 ui-monospace,monospace;overflow-wrap:anywhere}}td{{max-width:400px}}input,select{{padding:10px;font:inherit;margin:5px}}details{{margin-top:6px}}.toolbar{{padding:12px;background:#edf2f7}}small{{font-size:12px}}</style><h1>BibleLens: measured control inventory</h1><p><a href="report.md">Decision report</a> · <a href="inventory.csv">CSV inventory</a> · <a href="variants.json">Full computed/rule evidence</a></p><p>Live build 241, October 18, 2026. {len(allstates)} page/panel/state captures; {len(variants)} measured variant records, deduplicated to {len(rows)} rows below. Every variant has its own cropped screenshot; click to enlarge. Width/theme-dependent variants remain separate.</p><p><b>*Recorded placements count states, not unique product-wide controls.</b> Underlying page controls can also appear in modal captures in the first passes; targeted captures isolate active dialogs. The decision report uses explicit content snapshots for counts. Dynamic names, content wrapping, hover/focus and expanded states can create more than one row for a control. Fill includes the computed gradient separately; matching rules include overridden declarations, and do not imply every property wins. Lines map to this checkout's <code>src/style.css</code>; Timeline also has its own stylesheet. A hidden legacy rule is not a visually observed variant.</p><p>Inner input heights are not outer search-box heights. Raw radio inputs are not the visible target: use the labeled picker rows in targeted captures. Target flags consider both measured dimensions; the mode column lists viewport width. Contrast ratios on gradients are estimates, not confirmed failures. Flat ratios do not include glyph antialiasing; disabled controls are excluded from failures. Text in child badges can be smaller than its parent: see <a href="small-text.json">small-text scan</a> and report.</p><details><summary>Appearance counts by job</summary><ul>{intro}</ul></details><details><summary>All page screenshots / coverage</summary><ul>{''.join(pages)}</ul></details><div class="toolbar"><input id="q" type="search" placeholder="Search page, control, selector, size…" size="45"><select id="theme"><option value="">Both themes</option><option>dark</option><option>light</option></select><select id="width"><option value="">Both widths</option><option>1280</option><option>375</option></select><span id="count"></span></div><table><thead><tr><th>Job / pages / variant</th><th>Mode</th><th>Screenshot / state</th><th>Geometry / text / icon</th><th>Fill / border / ink</th><th>Flags / contrast</th><th>Selector / source lines</th></tr></thead><tbody>{''.join(body)}</tbody></table><script>const rows=[...document.querySelectorAll('tbody tr')];function filter(){{const q=document.querySelector('#q').value.toLowerCase(),t=document.querySelector('#theme').value,w=document.querySelector('#width').value;let n=0;for(const r of rows){{r.hidden=!!((t&&r.dataset.theme!==t)||(w&&r.dataset.width!==w)||!r.textContent.toLowerCase().includes(q));if(!r.hidden)n++;}}document.querySelector('#count').textContent=n+' of '+rows.length+' variants';}}for(const e of document.querySelectorAll('input,select'))e.addEventListener('input',filter);filter();</script></html>'''
(p/'inventory.html').write_text(text)
missing=[v['id']for v in variants if not (p/v['screenshot']).exists()]
print('rows',len(rows),'states',len(allstates),'missing screenshots',missing)
