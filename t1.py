import sys,os; sys.path.insert(0,os.getcwd())
from lib import *
k=kjv(10,4); print(type(k)); print(json.dumps(k,ensure_ascii=False)[:400])
g=grc('1KI',4); print(list(g.keys())); print(g.get('26'))
t=open('cache/grc_1KI04.htm',encoding='utf-8').read(); i=t.find('class="verse"'); print(t[i-300:i+500])
