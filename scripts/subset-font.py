"""03SmartFontUI を、サイトで使う文字だけに絞って woff2 にする。

使い方（フォントや本文を大きく変えた時だけ実行）:
    pip install fonttools brotli
    python scripts/subset-font.py

収録する文字:
  - ASCII / Latin-1 / 一般句読点 / ひらがな / カタカナ / CJK記号 / 全角英数
  - src/ 配下の .tsx と data/*.json に出てくる全文字
    （収録外の文字は monospace などのフォールバックで表示される）
原本 (03SmartFontUI.ttf / .woff) は消さない。出力: public/fonts/03SmartFontUI.subset.woff2
"""
import json
import pathlib
from fontTools import subset
from fontTools.ttLib import TTFont

root = pathlib.Path(__file__).resolve().parent.parent
src_font = root / 'public' / 'fonts' / '03SmartFontUI.ttf'
out_font = root / 'public' / 'fonts' / '03SmartFontUI.subset.woff2'

chars = set()
ranges = [
    (0x20, 0x7E), (0xA0, 0xFF), (0x2000, 0x206F), (0x2190, 0x21FF), (0x2500, 0x25FF),
    (0x3000, 0x303F), (0x3040, 0x309F), (0x30A0, 0x30FF), (0xFF00, 0xFFEF),
]
for a, b in ranges:
    chars.update(chr(c) for c in range(a, b + 1))

for p in (root / 'src').rglob('*'):
    if p.suffix in ('.tsx', '.ts', '.css', '.json') and p.is_file():
        chars.update(p.read_text(encoding='utf-8', errors='ignore'))
chars.discard('\n'); chars.discard('\r'); chars.discard('\t')

font = TTFont(src_font)
cmap = font.getBestCmap()
keep = sorted(c for c in chars if ord(c) in cmap)
print(f'requested {len(chars)} chars, font has {len(keep)} of them')

opts = subset.Options()
opts.flavor = 'woff2'
opts.layout_features = ['*']
opts.hinting = False
opts.name_IDs = ['*']
opts.notdef_outline = True
opts.glyph_names = False

sub = subset.Subsetter(opts)
sub.populate(text=''.join(keep))
sub.subset(font)
font.flavor = 'woff2'
font.save(out_font)
print(f'wrote {out_font.name}: {out_font.stat().st_size / 1024:.0f} KB (source ttf {src_font.stat().st_size / 1024:.0f} KB)')
