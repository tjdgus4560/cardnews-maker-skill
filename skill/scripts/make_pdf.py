# 카드 PNG들을 A4 페이지에 순서대로 배치한 PDF 생성
# 좌우 여백 0 (카드 폭 = A4 폭), 위아래 여백 존재 (정사각 카드라 자연 발생)
import os
from PIL import Image
# PDF 저장 시 Pillow가 내부적으로 JPEG 인코더를 쓰므로 플러그인을 명시적으로 등록
from PIL import JpegImagePlugin, PngImagePlugin  # noqa: F401

SRC = os.path.join(os.path.dirname(__file__), 'out')
DEST = os.path.join(os.path.dirname(__file__), 'shopify_river_cardnews.pdf')

# A4 @ 150 DPI (210 x 297 mm)
A4_W = round(210 / 25.4 * 150)   # 1240 px
A4_H = round(297 / 25.4 * 150)   # 1754 px
BG = (255, 255, 255)

files = sorted(f for f in os.listdir(SRC) if f.endswith('.png'))
pages = []
for f in files:
    card = Image.open(os.path.join(SRC, f)).convert('RGB')
    # 카드를 A4 폭에 꽉 맞춤 (좌우 여백 0)
    scale = A4_W / card.width
    new_w = A4_W
    new_h = round(card.height * scale)
    card = card.resize((new_w, new_h), Image.LANCZOS)

    page = Image.new('RGB', (A4_W, A4_H), BG)
    # 가로 0,0 / 세로 중앙 -> 위아래 여백 균등
    y = (A4_H - new_h) // 2
    page.paste(card, (0, y))
    pages.append(page)

pages[0].save(
    DEST, save_all=True, append_images=pages[1:],
    resolution=150.0, title='Shopify River Cardnews',
    quality=95
)
print(f'PDF 생성 완료: {len(pages)}페이지 -> {DEST}')
print(f'페이지 크기: {A4_W} x {A4_H} px (A4 @150dpi), 카드 폭={A4_W}, 카드 높이={new_h}, 상하 여백={ (A4_H-new_h)//2 }px')
