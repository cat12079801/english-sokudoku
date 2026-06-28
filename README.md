# English Sokudoku

英文を1単語ずつ高速表示して速読を鍛える RSVP (Rapid Serial Visual Presentation) リーダー。
バックエンドなしのフロントエンドのみで動作し、GitHub Pages にデプロイする。

## 特徴

- テキスト貼り付け / `.txt` アップロードで英文を読み込み
- 単語ごとに 1 つずつ中央表示し、ORP（基準文字）を赤でハイライト
- WPM (words per minute) を 100〜900 で調整
- 再生 / 一時停止、10 語スキップ、頭出し
- 句読点・長い単語で表示時間を自動延長
- [Project Gutenberg](https://www.gutenberg.org/) の定型ヘッダ/フッタ自動除去

ユーザに紐づくデータは持たないためバックエンドは不要。

### キーボードショートカット

| キー | 動作 |
| --- | --- |
| Space | 再生 / 一時停止 |
| ← / → | 10 語スキップ |
| Home | 頭出し |

## 開発

```sh
npm install
npm run dev      # http://localhost:5173/english-sokudoku/
npm run build    # 型チェック + 本番ビルド (dist/)
npm run preview  # ビルド成果物のプレビュー
```

## デプロイ

`main` への push で `.github/workflows/deploy.yml` が走り GitHub Pages へ自動デプロイされる。

リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定すること。

`vite.config.ts` の `base` はリポジトリ名 `/english-sokudoku/` を前提にしている。
リポジトリ名を変える、または独自ドメインを使う場合は `BASE_PATH` 環境変数で上書きする。

## ライセンスと英文ソースについて

本アプリは英文テキストを同梱せず、ユーザが都度入力する設計のため、テキストの権利は同梱しない。
[Project Gutenberg](https://www.gutenberg.org/) のテキストを利用する際は同サイトの利用条件に従うこと。
