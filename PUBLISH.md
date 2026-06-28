# npm 게시 방법 (당신이 직접 실행)

이 패키지를 npm에 올려서 다른 사람이 `npx`로 설치하게 만드는 절차입니다.
**무료 npm 계정만 있으면 되고, 인증·심사 없이 개인이 바로 게시할 수 있습니다.**

## 1. npm 계정 만들기 (최초 1회)

https://www.npmjs.com/signup 에서 가입(이메일만 있으면 됨). 이메일 인증까지 완료하세요.

## 2. 패키지 이름의 `@your-npm-id` 를 본인 아이디로 바꾸기

`package.json` 과 `README.md` 안의 `@your-npm-id` 를 **실제 npm 사용자명**으로 교체합니다.
예: 사용자명이 `gildong` 이면 → `@gildong/cardnews-maker`

PowerShell 에서 한 번에 바꾸려면 (패키지 폴더에서):

```powershell
$id = "여기에-본인-npm-아이디"
(Get-Content package.json) -replace '@your-npm-id', "@$id" | Set-Content package.json
(Get-Content README.md)    -replace '@your-npm-id', "@$id" | Set-Content README.md
```

## 3. 로그인

```bash
npm login
```
브라우저가 열리며 인증합니다. 끝나면 `npm whoami` 로 본인 아이디가 보이는지 확인.

## 4. 게시

스코프(@아이디) 패키지는 기본이 비공개라, **공개로 올리려면 `--access public` 필수**입니다:

```bash
npm publish --access public
```

성공하면 끝입니다. 이제 누구나 이렇게 설치합니다:

```bash
npx @sunghyun_han/cardnews-maker-skill
```

## 5. 업데이트 배포 (나중에 스킬을 고쳤을 때)

`package.json` 의 `version` 을 올린 뒤 다시 publish:

```bash
npm version patch   # 1.0.0 -> 1.0.1 (자동으로 version 필드 수정)
npm publish --access public
```

## 참고: 게시 없이 그냥 파일로 공유하고 싶다면

```bash
npm pack
```
→ `*.tgz` 파일이 생깁니다. 이 파일을 받은 사람은
`npx ./받은파일.tgz` 또는 `npm install -g ./받은파일.tgz && cardnews-maker-install`
로 설치할 수 있습니다. (npm 게시 불필요)
