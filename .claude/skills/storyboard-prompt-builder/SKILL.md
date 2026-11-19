---
name: storyboard-prompt-builder
description: 이야기, 대본, 아이디어를 장면(샷)별 스토리보드로 나누고 AI 이미지·영상 생성용 프롬프트를 만든다. 캐릭터 외모와 스타일을 모든 장면에서 일관되게 유지한다. 스토리보드, 콘티, 샷 리스트, 장면별 프롬프트, 미드저니/스테이블 디퓨전/DALL·E/영상 AI 프롬프트 요청 시 사용. Use for storyboard, shot list, or scene-by-scene image/video prompt requests.
---

# 스토리보드 프롬프트 빌더

사용자의 이야기를 장면별로 나누고, 장면마다 AI 도구에 바로 붙여 넣을 수 있는 프롬프트를 만든다.
사용자가 쓰는 언어로 대화하되, **프롬프트 본문은 영어로** 쓴다. 대부분의 이미지·영상 AI가 영어를 가장 잘 이해하기 때문이다. 사용자가 다른 언어를 원하면 그에 따른다.

## 1단계: 정보 모으기

아래 항목 중 빠진 것만 한 번에 묻는다. 사용자가 "알아서 해줘"라고 하면 괄호 안의 기본값을 쓰고, 무엇을 골랐는지 알려 준다.

1. **목적**: 광고, 단편 영화, 뮤직비디오, 설명 영상, 웹툰 등 (기본: 단편 영상)
2. **줄거리**: 요약, 대본, 또는 장면 목록
3. **장면 수** (기본: 줄거리에 맞게 4~8개)
4. **그림 스타일과 화면 비율** (기본: 시네마틱, 16:9)
5. **사용할 AI 도구**: Midjourney / Stable Diffusion / DALL·E·GPT 이미지 / 영상 AI(Runway, Kling, Veo, Sora 등) / 범용 (기본: 범용)

## 2단계: 캐릭터 시트 만들기

먼저 저장소의 `characters/` 폴더를 확인한다. 등장인물의 파일이 있으면 그 **고정 토큰, 버전별 차이 토큰, 그림체 토큰, 절대 하지 말 것**을 그대로 쓰고 새로 지어내지 않는다. 장면마다 어떤 버전(예: 후드 ON/OFF)인지 정한다. 파일이 없고 캐릭터가 중요하면 `character-design-sheet` 스킬로 먼저 정리하자고 제안한다.

참고 이미지가 있으면 그것을 관찰해 외모를 정한다.

등장인물마다 **고정 외모 설명**을 한 줄로 정한다. 나이, 성별, 머리 모양과 색, 옷, 눈에 띄는 소품을 넣는다.
- 예: `Mina — 60-year-old Korean woman, silver hair in a low bun, weathered navy wool coat, round wire glasses`
- 이 설명은 그 캐릭터가 나오는 **모든 장면의 프롬프트에 똑같은 문구로** 넣는다. 단어를 바꾸거나 줄이지 않는다. 이것이 장면 간 일관성의 핵심이다.
- 스타일 문구(예: `cinematic film still, anamorphic lens, shallow depth of field, film grain`)도 정해서 모든 장면에 똑같이 넣는다.

## 3단계: 장면 설계

장면마다 다음을 정한다. 장면이 이어질 때 샷 크기와 각도를 다양하게 섞는다. 예를 들어 와이드로 장소를 보여 준 뒤 미디엄, 클로즈업으로 들어간다.

| 항목 | 선택지 예시 |
| --- | --- |
| 샷 크기 | extreme wide, wide, full, medium wide, medium, medium close-up, close-up, extreme close-up, over-the-shoulder, POV, insert, two shot |
| 카메라 각도 | eye level, low angle, high angle, bird's-eye view, worm's-eye view, dutch angle, overhead top-down |
| 카메라 움직임 (영상용) | static, slow push in, pull out, pan, tilt, tracking, dolly zoom, handheld, crane up, orbit |
| 조명 | soft natural daylight, golden hour, blue hour, overcast, low-key chiaroscuro, high-key, neon, candlelight, moonlight, backlit silhouette |
| 기타 | 행동, 장소, 시간대, 분위기, 대사·효과음, 길이(초) |

대사와 효과음은 이미지 프롬프트에 넣지 않는다. 표에만 적는다.

## 4단계: 도구별 프롬프트 형식

모든 장면에서 같은 순서를 지킨다: **샷 크기·각도 → 행동 → 캐릭터 설명 → 장소·시간 → 조명 → 분위기 → 스타일**.

- **범용**: 쉼표로 구분한 키워드. 끝에 `aspect ratio 16:9`를 붙인다. 네거티브 프롬프트를 따로 적는다.
- **Midjourney**: 키워드 뒤에 `--ar 16:9`를 붙인다. 사용자가 원하면 `--v`, `--seed`, `--no`도 붙인다. 네거티브 프롬프트는 따로 쓰지 않는다.
- **Stable Diffusion / SDXL**: 스타일 문구를 맨 앞에 두고, 끝에 `highly detailed, sharp focus`를 붙인다. 네거티브 프롬프트를 따로 적는다.
- **DALL·E / GPT 이미지**: 자연스러운 영어 문장으로 쓴다. 예: `A close-up, low angle of ... Characters: ... Setting: ... Style: ... Aspect ratio 16:9. No text or captions in the image.`
- **영상 AI**: 문장을 마침표로 나누고 `camera: slow push in`, `duration: 4s`처럼 카메라 움직임과 길이를 넣는다.

기본 네거티브 프롬프트:
`blurry, low quality, deformed hands, extra fingers, distorted face, text, watermark, logo, signature, cropped`

## 5단계: 결과 보여 주기

다음 순서로 보여 준다.

1. **설정 요약**: 도구, 스타일, 화면 비율
2. **캐릭터 시트**: 이름과 고정 외모 설명
3. **장면 표**: 번호, 제목, 샷 크기, 각도, 움직임, 길이, 대사
4. **장면별 프롬프트**: 장면마다 제목을 달고, 복사하기 쉽게 코드 블록에 넣는다. 네거티브 프롬프트가 있으면 바로 아래에 둔다.

마지막에 다음 선택지를 짧게 제안한다.
- 다른 AI 도구 형식으로 바꾸기
- 특정 장면 수정하기
- 장면 추가하기
- 이 저장소의 웹앱(`index.html`)에 불러올 수 있는 JSON 파일로 저장하기

JSON 형식은 `prompt.js`의 `newProject()`, `newShot()` 구조를 따른다.
