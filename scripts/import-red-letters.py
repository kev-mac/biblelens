"""Import publisher words-of-Jesus spans; preserve every packaged scripture character.

Usage: python scripts/import-red-letters.py ../
Input: kjv-usfm.zip, web-usfm.zip downloaded from eBible.org/Scriptures.
ASV has no publisher wj markup. Transfer the KJV speech boundaries by token
alignment, accepting replacements only when the source segment has one speaker.
Mixed-speaker replacements fail rather than coloring narration as Jesus' speech.
"""
import base64, gzip, hashlib, json, re, sys, zipfile
from pathlib import Path
from difflib import SequenceMatcher

chapters = {k: json.loads(gzip.decompress(base64.b64decode(v))) for k,v in json.loads(Path('data/chapters.json').read_text()).items()}
codes = 'GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM EZK DAN HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV'.split()
word = re.compile(r"[\w]+(?:['’][\w]+)*", re.UNICODE)
norm = lambda s: s.lower().replace('’', "'")
sources = {}
hashes = {}
for edition in ('kjv','web'):
    file = Path(sys.argv[1]) / (edition+'-usfm.zip')
    hashes[edition] = hashlib.sha256(file.read_bytes()).hexdigest()
    with zipfile.ZipFile(file) as archive:
        for name in archive.namelist():
            if not name.endswith('.usfm'): continue
            text = archive.read(name).decode('utf-8-sig')
            code = re.search(r'\\id (\S+)', text).group(1)
            if code not in codes: continue
            book = codes.index(code)
            parts = re.split(r'\\c\s+(\d+)\s*',text)
            for c, body in zip(parts[1::2],parts[2::2]):
                verses = re.split(r'\\v\s+(\d+)\s*', body)
                for v, raw in zip(verses[1::2],verses[2::2]):
                    raw = re.sub(r'\\(?:f|x)\s.*?\\(?:f|x)\*','',raw,flags=re.S)
                    raw = re.sub(r'\\(?:s\d*|r|d|ms\d*|mt\d*|sp)\s[^\n]*','',raw)
                    raw = re.sub(r'\\\+?w\s+([^|\\]+)\|[^\\]+\\\+?w\*',r'\1',raw)
                    labels=[]; words=[]; red=False
                    for segment in re.split(r'(\\wj\*|\\wj\s)',raw):
                        if segment.startswith('\\wj'): red=not segment.startswith('\\wj*'); continue
                        clean=re.sub(r'\\[+a-zA-Z][\w-]*\*?\s*',' ',segment)
                        tokens=word.findall(clean);words.extend(tokens);labels.extend([red]*len(tokens))
                    if any(labels): sources[(book,int(c),int(v),edition)]=(words,labels)

# Reviewed ASV speech boundaries where wording/order differs at a speaker change.
# End anchors exclude replies by Peter, the crowd and the blind man.
asv_boundaries={
 ('39:4',7):('Again',None), ('39:17',11):('Elijah',None),
 ('39:17',26):('Therefore',None), ('39:19',11):('Not all',None),
 ('39:20',23):('My cup',None), ('40:4',9):('Who hath',None),
 ('40:10',51):('What wilt',' And the blind'), ('40:13',5):('Take heed',None),
 ('41:4',23):('Doubtless',None), ('41:8',45):('Who is',' And when'),
 ('41:9',20):('But who',' And Peter'), ('41:9',58):('The foxes',None),
 ('41:20',24):('Show me',' And they'), ('41:20',25):('Then render',None),
 ('42:1',38):('What seek',' And they'), ('42:2',16):('Take these',None),
 ('42:12',7):('Suffer her',None), ('42:19',11):('Thou wouldest',None),
 ('43:9',6):('but rise',None)
}
result={}; errors=[]; counts={}; mismatches=[]
for key, chapter in chapters.items():
    for verse in chapter['verses']:
        for edition in ('kjv','web','asv'):
            source=sources.get((chapter['book'],chapter['chapter'],verse['n'],'kjv' if edition=='asv' else edition)) if 'book' in chapter else sources.get((int(key.split(':')[0]),int(key.split(':')[1]),verse['n'],'kjv' if edition=='asv' else edition))
            if not source or not verse.get(edition):continue
            text=verse[edition]; matches=list(word.finditer(text)); target=[m.group() for m in matches]; sw,sl=source
            if edition=='asv' and (key,verse['n']) in asv_boundaries:
                start,end=asv_boundaries[(key,verse['n'])]
                result.setdefault(key,{}).setdefault(str(verse['n']),{})[edition]=[[text.index(start),text.index(end) if end else len(text)]]
                counts[edition]=counts.get(edition,0)+1
                continue
            labels=[False]*len(target)
            for op,a,b,c,d in SequenceMatcher(None,list(map(norm,sw)),list(map(norm,target)),autojunk=False).get_opcodes():
                if op=='equal':labels[c:d]=sl[a:b]
                elif op in ('replace','insert'):
                    nearby=sl[a:b] if a<b else sl[max(0,a-1):min(len(sl),a+1)]
                    if len(set(nearby))==1: labels[c:d]=[nearby[0]]*(d-c)
                    else: errors.append((key,verse['n'],edition,op,sw[a:b],target[c:d]))
                if op!='equal' and edition!='asv':mismatches.append((key,verse['n'],edition,op,sw[a:b],target[c:d]))
            spans=[]
            for i,m in enumerate(matches):
                if not labels[i]:continue
                start,end=m.span()
                if spans and i>0 and labels[i-1]:spans[-1][1]=end
                else:spans.append([start,end])
            if spans:
                result.setdefault(key,{}).setdefault(str(verse['n']),{})[edition]=spans
                counts[edition]=counts.get(edition,0)+1
if errors:
    print(json.dumps(errors,ensure_ascii=False,indent=2));raise SystemExit('Ambiguous speech alignment')
Path('src/red-letters.js').write_text('const RED_LETTERS='+json.dumps(result,separators=(',',':'),ensure_ascii=False)+';\n',encoding='utf-8')
Path('data/red-letter-provenance.json').write_text(json.dumps({'retrieved':'2026-10-12','sources':{'kjv':'https://ebible.org/Scriptures/eng-kjv_usfm.zip','web':'https://ebible.org/Scriptures/engwebp_usfm.zip'},'sha256':hashes,'versesWithSpeech':counts,'method':'Publisher USFM wj spans aligned to existing text. ASV boundaries transferred from KJV by token alignment; ambiguous mixed-speaker replacements rejected. All packaged text remains unchanged. Red-letter boundaries are editorial, including debated speech endpoints such as John 3.'},indent=2)+'\n')
Path('../red-letter-alignment-review.json').write_text(json.dumps(mismatches,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'counts':counts,'nonAsvDifferences':len(mismatches)},ensure_ascii=False))
