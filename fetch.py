import urllib.request, os, sys, json, concurrent.futures as cf
C=os.path.join(os.path.dirname(os.path.abspath(__file__)),'cache')
def get(url,name):
    p=os.path.join(C,name)
    if os.path.exists(p) and os.path.getsize(p)>200: return 'cached'
    for i in range(3):
        try:
            req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
            d=urllib.request.urlopen(req,timeout=40).read()
            open(p,'wb').write(d); return 'ok'
        except Exception as e: err=str(e)
    return 'FAIL '+err
jobs=[]
for ch in range(1,23):
    for ed in('WLC','HAC'): jobs.append((f'https://bolls.life/get-text/{ed}/11/{ch}/',f'{ed}_11_{ch}.json'))
    jobs.append((f'https://ebible.org/grcbrent/1KI{ch:02d}.htm',f'grc_1KI{ch:02d}.htm'))
    jobs.append((f'https://ebible.org/eng-Brenton/1KI{ch:02d}.htm',f'eng_1KI{ch:02d}.htm'))
for ch in (1,2,3,4,7,8,9,10,13,14,15,16,17,20):
    jobs.append((f'https://bolls.life/get-text/WLC/14/{ch}/',f'WLC_14_{ch}.json'))
    jobs.append((f'https://ebible.org/grcbrent/2CH{ch:02d}.htm',f'grc_2CH{ch:02d}.htm'))
with cf.ThreadPoolExecutor(8) as ex:
    for (u,n),r in zip(jobs,ex.map(lambda j:get(*j),jobs)):
        if r not in('ok','cached'): print(n,r)
print('done',len(jobs))
