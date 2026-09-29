import os, zipfile, json, re
from pathlib import Path

base = Path(r'c:\Users\WINDOWS\Downloads\project1\frontend')
archives = ['dist.zip', 'dist (2).zip', 'dist (3).zip']
for name in archives:
    path = base / name
    if not path.exists():
        continue
    print(f'=== {name} ===')
    with zipfile.ZipFile(path) as z:
        names = z.namelist()
        idx = None
        for candidate in ['dist/index.html', 'index.html']:
            if candidate in names:
                idx = candidate
                break
        if idx:
            html = z.read(idx).decode('utf-8', 'ignore')
            print('index html found:', idx)
            print('  title:', re.search(r'<title>(.*?)</title>', html, re.I|re.S))
            scripts = re.findall(r'<script[^>]+src="([^"]+)"', html)
            css = re.findall(r'<link[^>]+href="([^"]+)"', html)
            print('  scripts:', scripts)
            print('  css:', css)
            print('  contains hero_image:', 'hero_image' in html)
            print('  contains programs_image:', 'programs_image' in html)
        else:
            print('no index.html found')
        print('  bundle assets count:', sum(1 for n in names if n.endswith('.js') or n.endswith('.css') or n.endswith('.png') or n.endswith('.jpg') or n.endswith('.jpeg')))
        print('  asset names sample:')
        for n in names:
            if n.endswith(('.js', '.css', '.png', '.jpg', '.jpeg')):
                if 'assets/' in n or n.startswith('dist/assets/'):
                    print('   -', n)
        print()
