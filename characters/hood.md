# 후드 (Hood) — 문 (EXIT)

> 한 줄 소개: 방 안에 갇혀 있을 땐 후드 속 초록 눈만 보이고, 문을 연 뒤에야 후드를 벗고 얼굴을 드러내는 주인공.

**기본 의상: B (헤드폰 + 검은 와이드 바지 + 스크린톤)**. 의상 A는 원본 캐릭터 시트용 대체 버전이에요.

## 고정 토큰 (모든 프롬프트에 그대로)
```
Hood, a slim young teen character with a small head and long thin legs, wearing a huge oversized white hoodie with a large rounded hood, two black drawstrings, long baggy sleeves and big simple white mitten-like hands, low white sneakers with black outlines, slightly slouched posture, bold clean black outlines, flat cartoon style
```

## 그림체 토큰
**B (기본)**
```
flat cartoon illustration, thick clean black outlines, halftone dot screentone shading on the hoodie, mostly black and white with small bright green accents
```
**A (원본 시트)**
```
flat vector cartoon illustration, thick clean black outlines, flat fills, no gradients, minimal detail, limited palette of black, white and bright green
```
배경은 그림체 토큰에 넣지 않고 장면마다 정해요. 캐릭터 시트에서 쓰는 기본 배경은 `warm off-white background (#F3F0EA)`이고, 전신 컷에는 `solid black oval cast shadow under the feet`를 붙여요.

## 시그니처 요소
- 몸보다 훨씬 크고 둥근 흰 후드티
- 후드 ON: 얼굴은 완전한 검정, 빛나는 초록 눈 두 개만
- 후드 OFF: 짧은 검은 머리에 초록 브릿지 **한 줄**
- 선으로 그린 단순한 얼굴 (동그란 귀, 둥글게 말린 코선)
- 가늘고 긴 다리, 장갑 같은 큰 손

## 절대 하지 말 것
- 후드 ON일 때 코·입·피부를 그리지 않기 (눈 말고 전부 검정)
- 초록 브릿지를 다른 색이나 여러 줄로 그리지 않기
- 후드티에 로고·글자·무늬·다른 색 넣지 않기
- 실사 느낌, 3D, 그라데이션 넣지 않기
- 팔레트 밖의 색 쓰지 않기 (빨간 문은 배경 소품일 때만)

## 팔레트
| 색 | HEX | 쓰는 곳 |
| --- | --- | --- |
| 검정 | #0B0B0B | 외곽선, 후드 속 얼굴, 머리카락, 의상 B 바지 |
| 흰색 | #FFFFFF | 후드티, 피부, 신발, 헤드폰 |
| 밝은 초록 | #1FE070 | 눈, 브릿지, 의상 A 바지, 후드 OFF 표정 배경 |
| 진한 초록 | #13A955 | 의상 A 바지 그림자 |
| 크림 배경 | #F3F0EA (추정) | 기본 배경, 문 밖 세계 |
| 빨강 주황 | #E8461E (추정) | 문 (세계관 소품, 이 색은 문에만) |

## 상태·의상 버전
| 버전 | 언제 | 차이 토큰 |
| --- | --- | --- |
| 후드 ON | 방 안에 갇혀 있을 때 | `hood pulled up, face completely hidden in solid black shadow inside the hood, only two small glowing bright green eyes visible, no other facial features` |
| 후드 OFF | 문을 연 뒤 | `hood pushed down behind the neck, short messy black hair with a single bright green streak on top, simple line-drawn face with small curled nose line, round ear, white skin` |
| 의상 B + 후드 ON (기본) | | `wide-leg black trousers, sneakers with black stripes, chunky white headphones with dotted ear cups worn over the hood` |
| 의상 B + 후드 OFF (기본) | | `wide-leg black trousers, sneakers with black stripes, chunky white headphones with dotted ear cups resting around the neck` |
| 의상 A | 원본 시트 | `straight bright green pants with darker green shading` |

조립 순서: **고정 토큰 → 상태(ON/OFF) → 의상 → 장면 → 그림체 토큰**

## 전환 순서: 후드 벗는 순간
1. 후드를 쓴 채 구부정하게 서 있고, 초록 눈만 보여요.
2. 두 팔을 들어 후드 가장자리를 잡아요.
3. 후드를 뒤로 넘기면서 얼굴이 반쯤 드러나요. 브릿지가 처음 보여요.
4. 후드가 목 뒤로 내려가고(헤드폰은 목에 걸침), 고개를 돌려 앞을 바라봐요.

## 표정 세트
| 버전 | 표정 | 그리는 법 | 프롬프트 조각 |
| --- | --- | --- | --- |
| ON | 불안 | 가운데가 올라간 짧은 눈썹, 작은 눈 | `worried glowing green eyes with short raised inner brows` |
| ON | 겁 | 크고 동그란 점 눈 | `wide round glowing green dot eyes, frightened` |
| ON | 버팀 | `> <` 모양으로 질끈 감은 눈 | `squeezed shut eyes shaped like > <, straining` |
| ON | 결심 | 날카롭게 기운 좁은 눈 | `sharp narrow slanted glowing green eyes, determined` |
| OFF | 외침 | 동그랗게 벌린 입, 동그란 눈 | `shouting, open round mouth, wide eyes` |
| OFF | 다짐 | 찌푸린 눈썹, 일자 입 | `furrowed brows, flat line mouth, resolute side glance` |
| OFF | 안도 | 웃는 곡선 눈, 작은 미소 | `closed curved smiling eyes, small relieved smile` |
| OFF | 웃음 | 동그란 눈, 크게 벌린 웃는 입 | `bright open smile, round eyes, happy` |

표정 시트 배경: 후드 ON은 검정, 후드 OFF는 밝은 초록(#1FE070).

## 네거티브 프롬프트
```
realistic, 3D render, gradient shading, detailed face inside the hood, mouth or nose visible when hood is up, extra colors, logo or pattern on hoodie, multiple hair streaks, text, watermark, extra fingers
```

## 생성 이미지 체크리스트
- [ ] 후드가 몸보다 크고 둥근가?
- [ ] 후드 ON일 때 눈 말고는 얼굴이 전부 검정인가?
- [ ] 브릿지가 초록 한 줄뿐인가?
- [ ] 후드티에 무늬나 다른 색이 없는가?
- [ ] 바지가 선택한 의상과 맞는가? (B는 검정 와이드, A는 초록)
- [ ] 헤드폰 위치가 맞는가? (ON은 후드 위, OFF는 목)
- [ ] 선이 굵고 깔끔하며 그라데이션이 없는가?

## 챗GPT용 캐릭터 시트 프롬프트 (의상 B)
참고 이미지를 함께 첨부하고 붙여 넣어요.
```
Create a character design sheet (model sheet) for my original character "Hood", based on the attached reference images. Keep the design exactly as in the references.

Character: Hood, a slim young teen with a small head and long thin legs. Hood wears a huge oversized white hoodie with a large rounded hood, two black drawstrings, long baggy sleeves and big simple white mitten-like hands. Wide-leg black trousers, low white sneakers with black stripes, and chunky white headphones with dotted ear cups. Slightly slouched posture.

Two states:
- HOOD ON: the hood is pulled up and the face is completely hidden in solid black shadow. Only two small glowing bright green eyes are visible, with no nose, mouth or skin. The headphones are worn over the hood.
- HOOD OFF: the hood is pushed down behind the neck. Short messy black hair with a single bright green streak on top, a simple line-drawn face with a small curled nose line and a round ear, white skin. The headphones rest around the neck.

Layout on a warm off-white background (#F3F0EA), wide 4:3 sheet:
- Top left: large full-body HOOD ON, standing.
- Top center: large full-body HOOD OFF, same pose.
- Top right: a black panel with a 2x2 sequence of taking off the hood: 1 hood up, only green eyes; 2 both arms raised gripping the hood; 3 pulling the hood back, face half revealed; 4 hood down, head turned to look ahead.
- Bottom left: 4 square black panels, head and shoulders, HOOD ON expressions shown only through the green eyes: worried (short raised inner brows), scared (wide round dot eyes), enduring (squeezed shut eyes shaped like > <), determined (sharp narrow slanted eyes).
- Bottom right: 4 square bright green (#1FE070) panels, head and shoulders, HOOD OFF expressions: shouting (open round mouth), resolute (furrowed brows, flat mouth), relieved (closed curved smiling eyes, small smile), laughing (bright open smile).
- Bottom row: four round color swatches: #0B0B0B, #FFFFFF, #1FE070, #13A955.

Style: flat 2D cartoon illustration, thick clean black outlines, halftone dot screentone shading on the hoodie, mostly black and white with small bright green accents only, no gradients, no 3D, not realistic.

Do not draw any facial features inside the hood when it is up. Only one green hair streak. No logos or patterns on the hoodie. No text or labels anywhere.
```
