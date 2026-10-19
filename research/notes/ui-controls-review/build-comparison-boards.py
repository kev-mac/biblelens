from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,re,html,math,hashlib,collections,textwrap
P=Path(__file__).parent;ROOT=P.parents[2];OUT=P/'boards';OUT.mkdir(exist_ok=True);CROPS=OUT/'crops';CROPS.mkdir(exist_ok=True)
E=lambda s:html.escape(str(s))
V=json.loads((P/'variants.json').read_text());G=json.loads((P/'gap-captures.json').read_text())
TITLES={1:'Summary surfaces',2:'Passage and citation controls',3:'Expanded evidence layouts',4:'Search and question-entry boxes',5:'Quick filters',6:'Filter options in panels',7:'Related topics, people and places',8:'Dropdowns and value pickers',9:'Tabs, switches and sliders',10:'Expand and inspect controls',11:'Reset, apply and utility actions',12:'Navigation and icon actions',13:'Text fields and note editors',14:'Dialogs and panels',15:'Cards and content blocks',16:'Keyboard focus cues'}
DESCRIPTIONS={1:'Choose summary treatment independently of the surrounding card. Read, Marked and Chat share glass but differ in spacing; the profile biography has no separate surface.',2:'Direct passage navigation, citation previews and inline links are different jobs. You may keep multiple shapes with an explicit usage rule.',3:'The Read/Marked difference is verified: Read uses reference-beside-quote; Marked uses reference-above-quote. History/date comparisons serve another evidence job.',4:'Four list-search fields plus the Chat composer. The composer submits a question; its arrow is not a search icon. Retired search fields are listed separately.',5:'Colors may carry meaning. Compare shape, touch size, typography and selection feedback separately.',6:'These are facet/category choices inside filter panels, not quick-filter toolbars. Marked applies a draft; Commandments/Prophecies apply immediately.',7:'These controls navigate to topics, relatives, story profiles or places. Story themes are not pressed-state filters. Taxonomy badges are labels, not buttons.',8:'Native selects, step buttons, testament choices and number grids are different ways of choosing a value. All discovered families are shown.',9:'True tabs, category toggles and a range slider are separate jobs. Selected/checked variants are retained in the detailed gallery.',10:'Native disclosure rows, small card chevrons, inspect icons and History buttons all reveal information; their target sizes differ.',11:'Similar pill styling covers reset, filtering and completion actions. Keep their meaning and emphasis clear.',12:'Shared header, floating actions, modal close buttons, map controls and submit icons. Smaller dimensions are usability flags, not suggested targets.',13:'Blank note forms were opened without typing/saving. No private note text was copied. Account-only code input is source-reviewed separately.',14:'Centered dialogs and bottom sheets have different geometry. Context screenshots show surrounding content where useful.',15:'Compare card shell, title, spacing and reference treatment independently. Rich examples include Moses, Abraham, The Line of Seth and expanded chronology.',16:'Actual keyboard-focus captures. Input-only outline removal can be compensated by a wrapper ring. Native summary focus uses the browser outline.'}
# Return group, stable family, display name. Families are source components, not every repeated record or color.
def assign(v):
 s=(v.get('selector')or v.get('requestedSelector')or'');q=s.lower();cl=v.get('classes','');cs=set(cl.split());id_=v.get('elementId')or (s[1:]if s.startswith('#')and' 'not in s else'');tag=v.get('tag','');label=v.get('label','')
 if v.get('focusRecord'):return 16,v['focusFamily'],v['focusFamily']
 # Whole objects before their inner controls.
 if tag=='DIALOG' or id_ in ['verse-preview','context-preview']:return 14,id_ or cl,({'character-sheet':'Character profile','reader-settings':'Settings','study-dialog':'Legacy study workspace','verse-note-dialog':'Verse note editor','verse-preview':'Verse preview','navigation-sheet':'Navigation','passage-picker':'Passage picker','prophecy-filters':'Prophecy filters','commandments-filters':'Commandment filters','story-topic-sheet':'Theme-related stories','marked-filter-dialog':'Marked filters','atlas-sheet':'Places atlas'}.get(id_, 'Details and sources'if cl=='comparison-context-dialog'else id_ or cl))
 if 'comparison-summary'in cs or 'study-tldr'in cs:
  f='Chat answer'if'chat-answer'in cs or'chat'in q else'Marked assessment'if'marked'in q or'saved'in q else'Read assessment';return 1,f,f
 if '.study-heading p'in s:return 1,'Legacy study introduction','Legacy study introduction — plain text'
 if '.character-sheet-body > p'in s:return 1,'Character biography','Character biography — paragraph on popup surface'
 if 'comparison-sides'in cs or'marked-primary-passages'in cs or'context-citations'in cs:
  f='Marked references above quotations'if'marked'in q else'Read references beside quotations'if'comparison-panel'in q else'Context citations';return 3,f,f
 if 'character-verses'in cs:return 3,'Profile verse list','Character profile — key-verse layout'
 if id_=='atlas-map':return 15,'atlas-map','Atlas map surface'
 if 'character-connection-row'in cs:return 7,'Family row','Family row layout (contains relative controls)'
 if 'prophecy-bridge'in cs:return 3,'Paired prophecy passages','Paired prediction / fulfillment layout'
 if 'commandment-lens'in cs:return 3,'Commandment interpretive links','Commandment related-passage commentary'
 if any(x in cs for x in ['timeline-discrepancy','timeline-discrepancy-content','timeline-academic']):return 3,'History comparison '+('reviewed'if'discrepancy'in cl else'traditional'),'History comparison — '+('reviewed chronology'if'discrepancy'in cl else'traditional chronology')
 for cls,name in [('story-card','Story card'),('character-card','Character directory card'),('commandment-card','Commandment card'),('prophecy-card','Prophecy card'),('timeline-event-card','Reviewed Timeline card'),('timeline-card','Traditional Timeline card'),('marked-bookmark','Saved verse/passage card'),('passage-saved-card','Saved note card'),('analysis-box','Legacy perspective block'),('passage','Legacy study passage')]:
  if cls in cs:return 15,cls,name
 if 'chat-message'in cs and'user'in cs:return 15,'chat-question','Chat question bubble'
 if id_=='tab-content':return 13,'legacy-editor-context','Legacy Notes form — contextual view'
 # Navigation, close and icon actions before composer/filter wrappers.
 if id_=='chat-send':return 12,'chat-send','Chat send arrow'
 if id_=='clear-chat':return 12,'new-chat','Floating new conversation'
 if 'header > nav'in q or s.startswith('header')and tag=='BUTTON':return 12,'header-shortcut','Shared header shortcuts'
 if id_=='reader-picker':return 12,'header-settings','Shared header Settings icon'
 if 'brand'in cs:return 12,'header-title'if'header'in q else'footer-mark','Header navigation label'if'header'in q else'Footer BL mark'
 if 'skip'in cs:return 12,'skip-link','Skip link (keyboard access)'
 if 'navigation-grid'in q:return 12,'navigation-tile','Labeled navigation tile'
 if 'leaflet-control-zoom'in cl:return 12,'map-zoom','Map zoom control'
 if any(x in q for x in ['close','data-picker-close','data-navigation-close','data-close-comparison'] )or label.startswith('Close '):
  context='Settings'if'reader-settings'in q or id_=='reader-settings-close'else'Passage picker'if'passage-picker'in q else'Marked filters'if'marked-filter'in q else'Character profile'if'character-sheet'in q else'Prophecy filters'if'prophecy'in q else'Commandment filters'if'commandment'in q else'Story topics'if'story-topic'in q else'Atlas'if'atlas'in q else'Study workspace'if'study'in q or id_=='close-dialog'else'Verse preview'if'preview'in q else'Navigation'if'navigation'in q else'Details / sources';return 12,'close-'+context,'Close — '+context
 if 'chapter-round'in cs:return 12,'chapter-paging','Chapter paging arrows'
 # Search: pair inner fields with outer wrapper so shapes are not misreported.
 if id_=='stories-search':return 4,'stories-search','Stories — rounded search box, no icon'
 if id_=='characters-search'or'characters-search-box'in cs:return 4,'characters-search','Characters — pill, no icon'
 if id_=='commandments-search'or id_=='commandments-search-box':return 4,'commandments-search','Commandments — pill with magnifier'
 if id_=='chat-input'or id_=='chat-form'or'chat-form'in cs:return 4,'chat-composer','Chat — question composer with send arrow'
 if 'timeline-controls'in q and tag=='INPUT':return 4,'timeline-search','Timeline — rounded search box, no icon'
 if 'search-wrap'in cs or id_=='search':return 4,'hidden-study-search','Retired study search'
 # Reference controls.
 for cls,key,name in [('story-passage','story','Stories — direct passage'),('story-reference','story-preview','Stories — supporting citation'),('character-passage','character','Characters — direct passage'),('commandment-passage','commandment','Commandments — direct passage'),('prophecy-passage','prophecy','Prophecies — passage node'),('timeline-passage','timeline','Timeline — passage link'),('verse-link','chat-inline','Chat — inline verse link')]:
  if cls in cs:return 2,key,name
 if 'character-verses'in q and tag=='A':return 2,'profile-verses','Character profile — verse links'
 if 'verse-citation'in cs:
  f='Chat citations'if'chat'in cl or'chat'in q else'Marked citations'if'marked'in q or'saved'in q else'Bookmark citations'if'bookmark'in q else'Read evidence citations';return 2,f,f
 # Related navigation.
 for cls,key,name in [('story-theme','story-topic','Story theme navigation'),('character-relative-chip','relative','Relative / family profile chip'),('character-story-chip','linked-story','Linked-story glass chip'),('location-chip','place','Place-name / atlas chip'),('character-more-passages','more-passages','All passages — character profile link'),('character-name','character-title','Character name — profile link')]:
  if cls in cs:return 7,key,name
 if 'prophecy-taxonomy'in cs:return 7,'taxonomy-labels','Prophecy taxonomy labels (not interactive)'
 if 'character-badge'in cs:return 7,'legacy-relative','Legacy relative badge'
 # Filter options.
 if 'commandment-facet-toggle'in cs:return (6,'commandment-facet','Commandment panel facets')if'commandments-matrix'in q or'secondary'in cs else(5,'commandment-quick','Commandment quick filters')
 if 'prophecy-facet'in cs:return 6,'prophecy-facet','Prophecy panel facets'
 if 'prophecy-toggle'in cs:return 5,'prophecy-quick','Prophecy quick filters'
 if 'characters-women'in cs:return 5,'women','Women filter — meaningful pink cue'
 if 'marked-kind-grid'in q:return 6,'marked-category','Marked category tiles'
 if 'commandment-filter-chips'in q:return 6,'marked-commandment-type','Marked commandment-type chips'
 if 'category-filter'in cs:return 5,'reader-category','Read category toolbar (meaningful color/icon)'
 if 'comparison-tab'in cs:return 9,'reader-category-toggle','Verse category toggle icons'
 if 'data-timeline-filter'in q or ('glass-pill'in cs and'academic'in cs and'timeline-history'not in cl):return 5,'timeline-filter','Timeline Academic filter'
 # Value selection.
 if tag=='SELECT':
  name='Stories — book/theme selects'if id_.startswith('stories-')else'Settings — font selects'if id_ in ['verse-font-family','category-font-family']else'Settings — book-button position'if id_=='book-picker-position'else'Marked — conditional taxonomy selects'if id_.startswith('marked-')else'Passage picker — translation'if'passage'in q else'Passage picker — translation'if id_=='reader-edition'else'Legacy study — edition'if id_=='edition'else'Native select';return 8,name,name
 if 'passage-number'in cs:return 8,'passage-number','Passage picker radio labels / number cells'
 if 'passage-steps'in q or'data-passage-step'in q:return 8,'passage-steps','Passage picker steps'
 if 'marked-filter-dialog'in q and'passage-steps'in q:return 8,'marked-steps','Marked filter steps'
 if any(x in q for x in ['book-grid','chapter-grid','passage-testaments','number-grid']):
  f='Marked book grid'if'marked-book-grid'in q else'Marked chapter grid'if'marked-chapter-grid'in q else'Testament picker'if'passage-testaments'in q else'Book / number picker';return 8,f,f
 if 'passage-heading-picker'in cs:return 8,'passage-heading','Passage heading picker trigger'
 if 'passage-picker-trigger'in cs:return 12,'floating-book','Floating book-picker icon'
 if id_=='reader-font'or'type="range"'in q:return 9,'text-size-slider','Text-size slider'
 if id_=='reader-compare':return 9,'categories-switch','Categories on/off switch'
 if id_=='theme':return 9,'theme-toggle','Light/dark pressed-state button'
 if v.get('role')=='tab'or'character-profile-tabs'in q or'tab-'in id_:
  f='Character Overview/Connections tabs'if'character'in q else'Legacy study tabs';return 9,f,f
 # Revealing info.
 if 'summary-expand'in cs:return 10,'inner-chevron','Inner evidence expand/collapse chevron'
 if 'summary-inspect'in cs:return 10,'inner-inspect','Details / sources inspect icon'
 if 'timeline-history-chip'in cs:return 10,'traditional-history','Traditional Timeline History toggle'
 if 'timeline-history'in cs:return 10,'reviewed-history','Reviewed Timeline History toggle'
 if tag=='SUMMARY':
  f='Marked category rows'if'marked-category-pane'in q else'Marked theme rows'if'marked-theme'in q else'Commandment source row'if'commandments-source'in q else'Commandment passage row'if'commandment-summary'in q else'Timeline attribution'if'timeline-attribution'in q else'Source citations'if'citations-disclosure'in q else'Native disclosure';return 10,f,f
 if tag in ['TEXTAREA','INPUT']:
  f='Legacy multiline notes'if id_=='study-note'else'Verse multiline note'if id_=='verse-note-text'else'Note title field'if'title'in id_ else'Passage multiline notes'if id_=='passage-note'else'Text field '+(id_ or cl or'generic');return 13,f,f
 if 'preview-verse-actions'in cs:return 12,'verse-action-strip','Verse action strip'
 if 'preview-verse-actions'in q or'data-verse-action'in q or('#verse-preview button'in q and not label.startswith('Close')):return 12,'verse-action-icons','Verse action icons'
 if 'atlas-external'in cs:return 11,'external-map','Open external map link'
 if tag in ['BUTTON','A']:
  if 'characters-reset'in cs:return 11,'Reset filters','Reset filters'
  if id_ in ['passage-go','share','study-bookmark','font-size']:
   name={'passage-go':'Read chosen passage','share':'Copy study link','study-bookmark':'Bookmark study','font-size':'Text-settings shortcut'}[id_];return 11,name,name
  if tag=='A':
   name='Sign in with ChatGPT'if'sync-actions'in q else'Map attribution links'if'leaflet-control-attribution'in q else'Source / attribution links';return 11,name,name
  f='Reset filters'if'reset'in id_ or'clear filters'in label.lower()else'More/filter panel trigger'if'more'in id_ or'filter-open'in id_ or id_=='prophecy-filter-button'else'Apply/show results'if'done'in id_ or'apply'in id_ else'Clear dialog filters'if'clear'in id_ else'Pagination / load more'if'pagination'in q or'load-more'in id_ else'Save note'if'verse-note-form'in q else'Backup / restore'if'backup'in q or'export'in q else'Update check'if'release-settings'in q else'Sign-in / external action'if tag=='A'else'Study actions'if'study-actions'in q else'Utility '+re.sub(r':nth-of-type\(\d+\)','',q).split(' > ')[-1]
  return 11,f,f
 return 15,'Other block '+cl,'Other block '+(cl or id_ or tag)
records=[]
for v in V:
 z=dict(v);z['image']=v['screenshot'];z['elementWidth']=v.get('elementWidth');z['origin']='Original matrix';z['textScale']=100;z['context']=sorted(set(o['page']for o in v['occurrences']));z['sources']=v.get('rules',[]);z['sourceId']=v['id'];records.append(z)
# Cut newly captured block images from their true measured positions. Never synthesize missing live states.
for ci,c in enumerate(G):
 im=Image.open(P/c['screenshot']).convert('RGB');vw=c['viewport']['width'];vh=c['viewport']['height'];sx=im.width/vw;full=c.get('screenshotMode')=='fullPage'or(c.get('screenshotMode')is None and not c['modal']);sy=sx if full else im.height/vh
 for j,item in enumerate(c['items']):
  if full and item['requestedSelector'].startswith('#verse-preview'):continue # Full-page capture hid the fixed popover; retain the verified viewport capture instead.
  r=item['rect'];x=r['documentX']if full else r['x'];y=r['documentY']if full else r['y'];x1=max(0,round(x*sx));y1=max(0,round(y*sy));x2=min(im.width,round((x+r['width'])*sx));y2=min(im.height,round((y+r['height'])*sy))
  if x2<=x1 or y2<=y1:continue
  fraction=(x2-x1)*(y2-y1)/max(1,r['width']*sx*r['height']*sy)
  if fraction<.25:continue
  name=f'gap-{ci:02}-{j:02}.png';im.crop((x1,y1,x2,y2)).save(CROPS/name)
  z={**item,'elementId':(item.get('selector')or'').lstrip('#'),'selector':item.get('selector')or item['requestedSelector'],'sourceId':f'G{ci:02}.{j:02}','theme':c['theme'],'elementWidth':item['width'],'width':vw,'occurrences':[{'page':c['name'],'selector':item['requestedSelector'],'label':item['label']}],'image':'boards/crops/'+name,'screenshot':'boards/crops/'+name,'context':[c['name']],'origin':'Live gap capture','textScale':115,'croppedFraction':round(fraction,3),'sources':[]}
  records.append(z)
# Explicit focus evidence from the audit; screenshot exists for each probe.
for t in json.loads((P/'behaviors.json').read_text()):
 name=t['label'];f=P/'screenshots'/(name+'-focus.png')
 if not f.exists():continue
 theme='dark'if'-dark-'in name else'light';width=int(name.rsplit('-',1)[1]);family=name.split('-dark-')[0].split('-light-')[0]
 records.append({'sourceId':'F-'+name,'selector':t['selector'],'classes':'','tag':'INPUT','elementId':'','label':family+' keyboard focus','focusRecord':True,'focusFamily':family,'image':'screenshots/'+f.name,'screenshot':'screenshots/'+f.name,'theme':theme,'width':width,'height':0,'font':'','radius':'','fill':'','gradient':'','border':'','ink':'','shadow':t['focus']['shadow'],'outline':t['focus']['outline'],'context':[family],'sources':[],'occurrences':[],'origin':'Keyboard probe','textScale':100})
for t in json.loads((P/'focus-tests.json').read_text()):
 name=t['label'];file=P/'screenshots'/(name+'-focus.png')
 if not file.exists():continue
 theme='dark'if'-dark-'in name else'light';width=int(name.rsplit('-',1)[1]);family=name.split('-dark-')[0].split('-light-')[0]
 records.append({'sourceId':'F-'+name,'selector':t['selector'],'classes':'','tag':'SUMMARY','elementId':'','label':family+' keyboard focus','focusRecord':True,'focusFamily':family+' (browser outline)','image':'screenshots/'+file.name,'screenshot':'screenshots/'+file.name,'theme':theme,'width':width,'height':0,'font':'','radius':'','fill':'','gradient':'','border':'','ink':'','shadow':t['shadow'],'outline':t['outline'],'context':[family],'sources':[],'occurrences':[],'origin':'Keyboard probe','textScale':100})
# All source CSS, including map controls, participates in the static cross-check.
sheets=[('src/style.css',ROOT/'src/style.css'),('src/fonts.css',ROOT/'src/fonts.css'),('src/components/timeline/TimelineEventCard.css',ROOT/'src/components/timeline/TimelineEventCard.css'),('vendor leaflet.css',P/'vendor-leaflet.css')]
sourceRules=[];stylesheetSummary=[]
for filename,file in sheets:
 text=file.read_text();count=0
 # Leaf rules retain exact source line numbers. Comments are removed from selector preludes only.
 for m in re.finditer(r'([^{}]+)\{([^{}]*)\}',text):
  pre=re.sub(r'/\*.*?\*/','',m[1],flags=re.S).strip();decl=m[2]
  if not pre or pre.startswith('@'):continue
  pos=text.find(pre,m.start());line=text.count('\n',0,pos if pos>=0 else m.start())+1
  sourceRules.append({'file':filename,'line':line,'selector':pre,'css':decl});count+=1
 stylesheetSummary.append({'file':filename,'bytes':len(text.encode()),'sha256':hashlib.sha256(text.encode()).hexdigest(),'leafSelectorRules':count,'role':'font registration'if'fonts.css'in filename else'third-party map'if'leaflet'in filename else'app controls and containers'})
# Attach source candidates to new blocks. Full actual matched chains remain available for old controls.
for v in records:
 if v['sources']:continue
 tokens=[t for t in v.get('classes','').split()if not t.startswith('theme-')and t not in ['active','secondary','primary']]
 id_=v.get('elementId','');found=[]
 for rule in sourceRules:
  if (id_ and '#'+id_ in rule['selector'])or any(re.search(r'\.'+re.escape(t)+r'(?![\w-])',rule['selector'])for t in tokens):found.append(rule)
 v['sources']=found;v['sourceNote']='Source candidates by selector token; computed values measured live. Not a cascade-winner assertion.'
# Family directory; each original distinct measurement remains in its expandable gallery.
families=collections.OrderedDict()
for v in records:
 group,key,name=assign(v);k=(group,key)
 if k not in families:families[k]={'group':group,'key':key,'name':name,'variants':[]}
 families[k]['variants'].append(v)
# Stable alphabetical option names, with principal search choices ordered by page.
searchOrder={'stories-search':0,'characters-search':1,'commandments-search':2,'timeline-search':3,'chat-composer':4}
def letters(n):
 out='';n+=1
 while n: n,r=divmod(n-1,26);out=chr(65+r)+out
 return out
byGroup=collections.defaultdict(list)
for (g,k),f in families.items():byGroup[g].append(f)
for g,fs in byGroup.items():
 fs.sort(key=lambda f:(searchOrder.get(f['key'],50),f['name'])if g==4 else(f['name'],))
 for i,f in enumerate(fs):f['id']=f'D{g}-{letters(i)}'
# Pick an informative actual image, preferring a complete control and appropriate screenshot mode.
def score(v,g):
 val=0
 if v['theme']=='dark':val+=10
 if v['width']==(375 if g in [4,5,6,8,9,10,11,12]else 1280):val+=6
 if v.get('pressed')in [None,'false']:val+=1
 if v.get('disabled'):val-=8
 if v.get('croppedFraction',1)<.98:val-=30
 if v['origin']=='Live gap capture'and g in [1,3,13,14,15]:val+=8
 if 'clean'in ' '.join(v['context'])and v.get('croppedFraction',1)>.98:val+=60
 if g==1 and 'collapsed'in ' '.join(v['context']):val+=50
 if g==1 and v.get('height',999)<240:val+=8
 if g==4 and (v['tag']=='FORM'or'search-box'in v.get('classes','')or v.get('elementId')in ['stories-search','commandments-search-box']):val+=30
 if v['tag']=='INPUT'and v.get('elementId')in ['characters-search','commandments-search','chat-input']:val-=30
 if v.get('captureError'):val-=20
 if 'character-profile' in ' '.join(v['context'])and g not in [1,13,14,15]:val-=1
 return val
# Dedup visual appearance records within family. Context/source instances are merged, never discarded.
for fs in byGroup.values():
 for f in fs:
  ded={}
  for v in f['variants']:
   sig=tuple(str(v.get(x))for x in ['theme','width','font','radius','height','fill','gradient','border','ink','pressed','disabled','outline','shadow'])
   if sig not in ded:ded[sig]=dict(v)
   else:ded[sig]['context']=sorted(set(ded[sig]['context']+v['context']))
  f['variants']=list(ded.values());f['representative']=max(f['variants'],key=lambda v:score(v,f['group']));f['contexts']=sorted(set(x for v in f['variants']for x in v['context']))
# Render readable image boards, split into manageable sheets. Unscaled crops preserve text where possible.
FONT='/System/Library/Fonts/Supplemental/Arial.ttf';BOLD='/System/Library/Fonts/Supplemental/Arial Bold.ttf'
font=lambda n,b=False:ImageFont.truetype(BOLD if b else FONT,n)
def wrap(draw,text,f,w):
 words=text.split();out=[];line=''
 for word in words:
  candidate=(line+' '+word).strip()
  if draw.textlength(candidate,font=f)>w and line:out.append(line);line=word
  else:line=candidate
 if line:out.append(line)
 return out
boardFiles=[]
for g in sorted(byGroup):
 fs=byGroup[g];per=6 if g in [1,3,14,15]else 8
 for part,start in enumerate(range(0,len(fs),per),1):
  chunk=fs[start:start+per];cols=2;tileW=580;imageH=270 if g in [1,3,14,15]else 130;tileH=imageH+142;head=95;foot=46
  canvas=Image.new('RGB',(tileW*2,head+math.ceil(len(chunk)/2)*tileH+foot),'#f4f7fb');d=ImageDraw.Draw(canvas)
  d.text((20,12),f'D{g} · {TITLES[g]}'+(f' · sheet {part}'if len(fs)>per else''),font=font(25,True),fill='#172232')
  d.text((20,48),'Existing app styles. Keep one, several or all; tell me where each should be used.',font=font(16),fill='#475569')
  for i,f in enumerate(chunk):
   x=(i%2)*tileW;y=head+(i//2)*tileH;v=f['representative'];d.rounded_rectangle((x+10,y+6,x+tileW-10,y+tileH-8),radius=12,fill='#ffffff',outline='#cbd5e1',width=1)
   lines=wrap(d,f['id']+' · '+f['name'],font(17,True),tileW-48)
   for li,line in enumerate(lines[:2]):d.text((x+22,y+16+li*21),line,font=font(17,True),fill='#172232')
   im=Image.open(P/v['image']).convert('RGB');maxW=tileW-48;maxH=imageH
   scale=min(1,maxW/im.width,maxH/im.height);size=(max(1,round(im.width*scale)),max(1,round(im.height*scale)));im=im.resize(size,Image.Resampling.LANCZOS)
   yy=y+66;canvas.paste(im,(x+22,yy))
   bottom=y+66+imageH+5
   shownFont=v.get('font','?')
   if g==4:
    inner={'characters-search':'characters-search','commandments-search':'commandments-search','chat-composer':'chat-input'}.get(f['key'])
    if inner:
     matches=[r for r in records if r.get('elementId')==inner and r['theme']==v['theme']and r['width']==v['width']and r['textScale']==v['textScale']]
     if matches:shownFont=matches[0]['font']
   dims=f"r {v.get('radius','?')} · {float(v.get('elementWidth')or 0):.0f}×{float(v.get('height')or 0):.1f}px · text {shownFont}"if not v.get('focusRecord')else v.get('outline','')
   d.text((x+22,bottom),dims[:78],font=font(14),fill='#334155')
   mode=f"{v['theme']} · {v['width']}px viewport · text setting {v['textScale']}%"
   if v.get('croppedFraction',1)<.98:mode+=' · partial block'
   d.text((x+22,bottom+21),mode,font=font(13),fill='#64748b')
   d.text((x+22,bottom+42),f"{len(f['variants'])} measured appearances · full images/rules in HTML gallery",font=font(13),fill='#64748b')
  d.text((20,canvas.height-30),'Boards compare existing styles, not proposed P2 designs. Image thumbnails may be reduced; measurements are not.',font=font(14),fill='#475569')
  name=f'D{g:02}-{part:02}.png';canvas.save(OUT/name);boardFiles.append({'group':g,'part':part,'image':'boards/'+name,'options':[f['id']for f in chunk]})
# Every measurement is retained in a machine-readable manifest and a readable nested gallery.
manifest={'scope':'Live web UI plus explicitly identified source-only/hidden states','originalVariantRecords':len(V),'newGapCaptures':len(G),'newMeasuredRecords':len(records)-len(V),'stylesheets':stylesheetSummary,'boards':boardFiles,'families':[{k:v for k,v in f.items()if k!='representative'}|{'representative':f['representative']['sourceId']}for g in sorted(byGroup)for f in byGroup[g]]}
(P/'comparison-manifest.json').write_text(json.dumps(manifest,indent=2))
css='''body{margin:0;background:#f4f7fb;color:#203040;font:15px/1.5 system-ui}main{max-width:1420px;margin:auto;padding:24px}h1{font-size:28px}h2{font-size:24px;margin:0 0 8px}a{color:#12669b}nav{display:flex;gap:8px;flex-wrap:wrap}nav a,.pill{background:white;border:1px solid #cbd5e1;padding:6px 10px;border-radius:18px}section{margin:26px 0;padding:20px;background:white;border:1px solid #cbd5e1;border-radius:14px}.board{width:100%;height:auto;border:1px solid #dce3ea}.choices{display:flex;gap:10px;flex-wrap:wrap;padding:12px 0}.choices label{padding:9px;background:#edf3f9;border-radius:6px}details{margin:10px 0;padding:10px;background:#f5f8fc;border-radius:7px}.variants{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:14px}.variant{border:1px solid #d2dbe5;padding:12px;background:white;overflow-wrap:anywhere}.variant img{max-width:100%;max-height:360px;object-fit:contain;object-position:left top;background:#142033}.meta{font-size:13px;color:#526176}code{font:12px/1.45 ui-monospace,monospace}table{border-collapse:collapse;width:100%;font-size:13px}td,th{text-align:left;vertical-align:top;border:1px solid #d2dbe5;padding:7px}textarea{width:100%;box-sizing:border-box;min-height:85px;padding:10px;font:inherit}button{font:inherit;padding:10px 14px;margin:8px 8px 8px 0;cursor:pointer}aside{padding:14px;background:#fff5d8;border:1px solid #e6c874;border-radius:8px}.toolbar{position:sticky;top:0;z-index:2;background:#e7eef6;padding:8px;border-bottom:1px solid #cbd5e1}.toolbar input,.toolbar select{font:inherit;padding:8px;margin:4px}.hidden{display:none}input[type=checkbox]{width:19px;height:19px;vertical-align:middle}small{font-size:12px}.page-links{columns:2}.partial{color:#995400}'''
sections=[]
for g in sorted(byGroup):
 fs=byGroup[g];imgs=''.join(f'<a href="{b["image"]}"><img class="board" loading="lazy" src="{b["image"]}" alt="D{g} comparison sheet {b["part"]}"></a>'for b in boardFiles if b['group']==g)
 choices=''.join(f'<label><input type="checkbox" class="choice" value="{f["id"]}" data-name="{E(f["name"])}"> {f["id"]} — {E(f["name"])}</label>'for f in fs)
 galleries=[]
 for f in fs:
  tiles=[]
  for v in sorted(f['variants'],key=lambda v:(v['theme'],v['width'],str(v.get('pressed')))):
   srcs=''.join(f'<li><code>{E(r["file"])}:{r.get("line","?")} {E(r["selector"])}</code></li>'for r in v['sources'])
   vals={k:v.get(k)for k in ['radius','height','elementWidth','font','lineHeight','padding','fill','gradient','border','ink','shadow','blur','outline','pressed','disabled']if v.get(k)is not None}
   metrics='<br>'.join(f'<b>{E(k)}</b>: {E(val)}'for k,val in vals.items())
   partial='<p class="partial">Visible portion of block; use contextual capture/measurements for full dimensions.</p>'if v.get('croppedFraction',1)<.98 else''
   tiles.append(f'<article class="variant" data-mode="{v["theme"]}-{v["width"]}"><label><input type="checkbox" class="choice" value="{f['id']}@{E(v['sourceId'])}" data-name="{E(f['name'])} — {v['theme']} {v['width']}px"> <b>{E(v["sourceId"])}</b></label> · {v["theme"]} · {v["width"]}px · text {v["textScale"]}%<p><a href="{v["image"]}"><img loading="lazy" src="{v["image"]}" alt="{E(v.get("label",f["name"]))}"></a></p>{partial}<p class="meta">{E(v.get("label",""))}<br>{E(", ".join(v["context"]))}</p><details><summary>Measurements / selector</summary><code>{E(v["selector"])}</code><p>{metrics}</p></details><details><summary>Source selectors and lines</summary><p class="meta">{E(v.get("sourceNote","Actual matched rules; some properties are overridden."))}</p><ol>{srcs}</ol></details></article>')
  galleries.append(f'<details class="family-detail"><summary><b>{f["id"]} — {E(f["name"])}</b> · {len(f["variants"])} appearances</summary><p>Observed in: {E(", ".join(f["contexts"]))}</p><div class="variants">{"".join(tiles)}</div></details>')
 sections.append(f'<section id="D{g}" data-title="{E(TITLES[g])}"><h2>D{g} — {E(TITLES[g])}</h2><p>{E(DESCRIPTIONS[g])}</p>{imgs}<div class="choices">{choices}</div><label>Where should these be used? Anything to change?<textarea class="usage" data-group="D{g}" placeholder="Example: Keep A for direct passages and C for inline citations. Keep both colors."></textarea></label><details><summary>All measured variants, dark/light, desktop/phone, states and CSS references</summary>{"".join(galleries)}</details></section>')
nav=''.join(f'<a href="#D{g}">D{g} {E(TITLES[g])}</a>'for g in sorted(byGroup))
sourceTable=''.join(f'<tr><td>{E(s["file"])}</td><td>{s["leafSelectorRules"]}</td><td>{E(s["role"])}</td><td><code>{s["sha256"][:16]}</code></td></tr>'for s in stylesheetSummary)
page=f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BibleLens — choose styles to keep</title><style>{css}</style><body><div class="toolbar"><a href="#top">Top</a> · <a href="#choices">Your choices</a> · <label>Show component group <select id="group"><option value="">All groups</option>{''.join(f'<option value="D{g}">D{g} — {E(TITLES[g])}</option>'for g in sorted(byGroup))}</select></label><span id="selection-count">0 styles selected</span></div><main id="top"><h1>BibleLens: choose the styles to keep</h1><p><b>TL;DR:</b> Existing controls and cards vary in shape, size, spacing and feedback. Some differences carry useful meaning; others are styling drift. These boards show the discovered families together so you can keep one, several or all, and say where each belongs. Nothing here changes BibleLens.</p><p>{len(byGroup)} groups · {len(families)} source-component families · {len(boardFiles)} comparison sheets · {len(V)} original variant records + {len(G)} new gap captures.</p><p>D1–D3 retain the walkthrough topics. D4 onward adds the independent inventory. The old report.md has different decision numbers and is superseded for choosing styles by this page. No options are preselected.</p><aside><b>Coverage boundary:</b> all four loaded stylesheets were reviewed, including vendor map CSS. The original web matrix covers dark/light at 1280px and 375px with 100% text. Live additions were taken with the owner’s existing 115% text setting; it was preserved, not treated as drift. Full-card additions include both themes and widths where captured; some long blocks are viewport excerpts. This is not an installed-native review or a proof of every possible data/error state. Account-only sync actions, destructive note confirmation and retired hidden UI are source-reviewed, not falsely presented as live captures. <a href="coverage-gaps.md">Detailed coverage and source-only states</a>.</aside><p>Every group has comparison sheets plus an expandable gallery retaining every captured appearance. Thumbnail images can be reduced; original screenshots and measured CSS values are linked. Keep colors independently of shapes. P1/P2 compatibility does not imply a P2 redesign.</p><nav>{nav}</nav>{''.join(sections)}<section id="choices"><h2>Your choices — multiple styles allowed</h2><p>Select any number of styles per group and add usage rules. These checkboxes are a review worksheet; they do not implement anything. Download before closing to preserve selections, or reply in chat with the option IDs.</p><button id="summarize">Update choice summary</button><button id="download">Download choices</button><textarea id="summary" style="min-height:220px" readonly></textarea></section><section><h2>Appendix: stylesheet and evidence inventory</h2><table><tr><th>Stylesheet</th><th>Leaf selector rules</th><th>Role</th><th>SHA-256 prefix</th></tr>{sourceTable}</table><p><a href="comparison-manifest.json">Complete board manifest and measurements</a> · <a href="inventory.html">Original control inventory</a> · <a href="css-findings.md">CSS conflicts</a> · <a href="live-walkthrough.md">Owner’s observations</a> · <a href="source-previews.html">Unverified source-only inspection sheet</a></p></section></main><script>const groups=[...document.querySelectorAll('section[data-title]')];document.querySelector('#group').addEventListener('change',e=>{{for(const s of groups)s.hidden=!!e.target.value&&s.id!==e.target.value;}});function summary(){{const choices=[...document.querySelectorAll('.choice:checked')];document.querySelector('#selection-count').textContent=choices.length+' styles selected';const lines=['BibleLens UI style decisions — owner worksheet','No implementation is authorized by this file alone.',''];for(const s of groups){{const kept=[...s.querySelectorAll('.choice:checked')].map(e=>e.value+' ('+e.dataset.name+')');const rule=s.querySelector('.usage').value.trim();if(kept.length||rule)lines.push(s.id+': '+(kept.join(', ')||'undecided')+(rule?'\\nUse: '+rule:''),'');}}if(lines.length===3)lines.push('No styles selected.');document.querySelector('#summary').value=lines.join('\\n');return lines.join('\\n');}}for(const e of document.querySelectorAll('.choice,.usage'))e.addEventListener('input',summary);document.querySelector('#summarize').onclick=summary;document.querySelector('#download').onclick=()=>{{const a=document.createElement('a');const u=URL.createObjectURL(new Blob([summary()],{{type:'text/plain'}}));a.href=u;a.download='BibleLens-owner-style-choices.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}};</script></body></html>'''
(P/'comparison-boards.html').write_text(page)
(P/'stylesheet-audit.json').write_text(json.dumps({'stylesheets':stylesheetSummary,'rules':sourceRules},indent=2))
print(json.dumps({'groups':len(byGroup),'families':len(families),'sheets':len(boardFiles),'records':len(records),'groupFamilies':{str(g):len(fs)for g,fs in sorted(byGroup.items())}},indent=2))
