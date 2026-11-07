import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import postcss from 'postcss';
const read=file=>fs.readFileSync(file,'utf8');
const html=read('src/index.html'),atlas=read('src/atlas-reader.js'),workspace=read('src/workspace.js'),shell=read('src/workspace-shell.js'),css=read('src/overrides.css');
assert.equal((html.match(/id="lens-settings"/g)||[]).length,1);
assert(!shell.includes("settings.dataset.openSettings=''")&&!shell.includes("settings.className='directory-settings-open'"),'One shared settings entry, without cloned gears');
assert(!workspace.includes('id="lens-compare"')&&!workspace.includes("el('lens-compare')"));assert(!atlas.includes("control('lens-compare')"));
assert(workspace.includes("event.target.closest('[data-context-compare]')"));assert(workspace.includes("path==='#compare'"));
assert(html.includes('<details class="study-library" hidden inert>'));assert(html.includes('id="collection"'),'Keep legacy records and hooks without exposing the reader disclosure');
assert(read('src/reader.js').includes('${esc(b.name)}</span>'),'Picker retains full book names');
const readerSource=read('src/reader.js'),bookGrid={value:'0',innerHTML:''};
const pickerContext={books:[...JSON.parse(read('data/books.json')),...JSON.parse(read('data/lost-books/books.json'))],passagePicker:{dataset:{},querySelectorAll:()=>[]},$:selector=>bookGrid,esc:value=>String(value)};
vm.createContext(pickerContext);vm.runInContext(readerSource.slice(readerSource.indexOf('function renderPassageBooks('),readerSource.indexOf('function setPassageStep(')),pickerContext);
for(const [group,first,last,count] of [['old','Genesis','Malachi',39],['new','Matthew','Revelation',27]]){
 pickerContext.renderPassageBooks(group);assert.equal((bookGrid.innerHTML.match(/type="radio"/g)||[]).length,count);assert(bookGrid.innerHTML.includes('<span>'+first+'</span>'));assert(bookGrid.innerHTML.includes('<span>'+last+'</span>'));
}
pickerContext.renderPassageBooks('old');assert(bookGrid.innerHTML.includes('<span>Song of Solomon</span>'),'Full names, not historical abbreviations');
assert(!atlas.includes('fitPassageLabel')&&!atlas.includes('style.fontSize'),'Passage names must wrap rather than shrink');
assert(atlas.includes('id="ux-chapter-picker" aria-label="Choose chapter" aria-haspopup="dialog" aria-controls="passage-picker"'));
assert(read('src/reader.js').includes("($('#ux-chapter-picker')||document.querySelector('.passage-heading-picker'))?.focus"));
const geometry=shell.slice(shell.indexOf('function measureWorkspaceHeader(){'),shell.indexOf('const headerObserver='));
const styles=new Map(),bodyStyles=new Map();let headerHeight=64,barHeight=52;
const ctx={masthead:{getBoundingClientRect:()=>({height:headerHeight})},document:{documentElement:{style:{setProperty:(k,v)=>styles.set(k,v)}},body:{style:{setProperty:(k,v)=>bodyStyles.set(k,v)}}},el:()=>({getBoundingClientRect:()=>({height:barHeight})})};
vm.createContext(ctx);vm.runInContext(geometry,ctx);
for(const [header,bar] of [[64,52],[76,52],[96.2,82.5]]){headerHeight=header;barHeight=bar;ctx.measureWorkspaceHeader();assert.equal(styles.get('--ux13-masthead-height'),Math.ceil(header)+'px');assert.equal(bodyStyles.get('--ux13-masthead-height'),Math.ceil(header)+'px','Measured height overrides responsive body fallbacks');assert.equal(styles.get('--reader-bar-height'),Math.ceil(bar)+'px');}
// Parse the real cascade: safe-area handling and readable targets apply outside phone-only media queries.
const tree=postcss.parse(css),rules=[];tree.walkRules(rule=>rules.push(rule));
const declaration=(selector,property)=>rules.filter(rule=>!rule.parent.name&&rule.selector===selector).flatMap(rule=>rule.nodes.filter(node=>node.prop===property)).at(-1)?.value;
assert.equal(declaration('html body.lens-app #chapter-text :is(.chapter-heading-row,.chapter-heading-row *)','text-shadow'),'none');
assert.equal(declaration('html body.lens-app,\nhtml.native-ios body.lens-app','padding-top'),'var(--app-safe-top)');
assert.equal(declaration('html body.lens-app > #lensMasthead.lens-masthead','top'),'var(--app-safe-top)');
assert.equal(declaration('html body.lens-app #lensReadingBar','top'),'calc(var(--app-safe-top) + var(--ux13-masthead-height))');
assert.equal(declaration('html.native-ios body.lens-app > #lensMasthead.lens-masthead','top'),'calc(var(--app-safe-top) + var(--visual-offset-top,0px))');
assert.equal(declaration('html.native-ios body.lens-app #lensReadingBar','top'),'calc(var(--app-safe-top) + var(--visual-offset-top,0px) + var(--ux13-masthead-height))');
assert.equal(declaration('html body.lens-app #lensReadingBar #ux-chapter-picker','min-height'),'44px');
assert.match(declaration('html body.lens-app #lensReadingBar #ux-chapter-picker','font'),/1\.125rem/);
assert.equal(declaration('html body.lens-app #ux-chapter-picker .ux-picker-book','white-space'),'normal');
assert.match(declaration('html body.lens-app #passage-picker .passage-book-grid','grid-template-columns'),/auto-fit/);
assert.match(declaration('html body.lens-app #passage-picker .passage-number-grid','grid-template-columns'),/max\(44px,2\.5rem\)/);
assert.equal(declaration('html body.lens-app #passage-picker .passage-number','min-height'),'44px');
assert.equal(declaration('html body.lens-app #passage-picker .passage-number span','border-radius'),'var(--control-radius,12px)');
assert.equal(declaration('html body.lens-app :is(a,a:hover,a:focus,a:active,[data-cite],.person-chip,.location-chip)','text-decoration'),'none');
assert(declaration('html body.lens-app :is(a,#ux-chapter-picker,#lens-settings):focus-visible','outline').includes('3px solid'));
const storySource=read('src/stories.js').split('let storiesActive=')[0].replace('/*__STORY_IMAGES__*/{}',JSON.stringify({'A <title>':{src:'/art.webp',alt:'Imagined scene: source description',width:1200,height:675}}));
const storyCtx={esc:value=>String(value).replaceAll('<','&lt;').replaceAll('>','&gt;')};vm.createContext(storyCtx);vm.runInContext(storySource,storyCtx);
const figure=storyCtx.storyIllustration('A <title>','reader');assert(figure.includes('<figcaption>A &lt;title&gt;</figcaption>'));assert(figure.includes('alt="Imagined scene: source description"'),'Retain descriptive alt text');assert(!storyCtx.storyIllustration('A <title>').includes('<figcaption>'));
console.log('PASS: single settings entry, safe-area/header geometry, wrapping 44px picker, unadorned links with focus cues, escaped actual captions, hidden reader records and retained comparison routes. Browser layout is a separate check.');
