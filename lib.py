import json,re,gzip,base64,os,html,sys
sys.stdout.reconfigure(encoding='utf-8')
P=r'C:\Users\kevma\Documents\Codex\2026-10-11\referenced-chatgpt-conversation-this-is-an\work\source-check'
C='cache'
_ch=None
def kjv(b,c):
    global _ch
    if _ch is None: _ch=json.load(open(P+r'\data\chapters.json',encoding='utf-8'))
    v=_ch[f'{b}:{c}']
    if isinstance(v,str): v=json.loads(gzip.decompress(base64.b64decode(v)).decode('utf-8'))
    return v
def heb(ed,b,c):
    d=json.load(open(f'{C}/{ed}_{b}_{c}.json',encoding='utf-8'))
    return {x['verse']:html.unescape(re.sub(r'<[^>]+>','',x['text'])).strip() for x in d}
def grc(code,c,lang='grc'):
    t=open(f'{C}/{lang}_{code}{c:02d}.htm',encoding='utf-8').read()
    m=re.search(r'<div class=.main.>(.*?)<ul class=.tnav',t,re.S) or re.search(r'<body[^>]*>(.*)</body>',t,re.S)
    t=m.group(1)
    t=re.sub(r'<a href="#FN.*?</a>','',t,flags=re.S)
    parts=re.split(r'<span class="verse" id="V(\w+)">.*?</span>',t,flags=re.S)
    out={}
    for i in range(1,len(parts),2):
        s=html.unescape(re.sub(r'<[^>]+>','',parts[i+1]))
        s=re.sub(r'\s+',' ',s).strip()
        out[parts[i]]=out.get(parts[i],'')+(' ' if parts[i] in out else '')+s
    return out
