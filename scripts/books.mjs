// 同梱する作品のマニフェスト。
// id は Project Gutenberg の ebook ID。level / titleJa / blurb は学習者向けに人手で付与。
// fetch-texts.mjs がこの一覧を読み、本文取得・整形・catalog.json 生成を行う。

/** @typedef {{ id: number, slug: string, title: string, titleJa: string, author: string, level: string, blurb: string }} Book */

/** @type {Book[]} */
export const BOOKS = [
  {
    id: 11339,
    slug: 'aesop-fables',
    title: "Aesop's Fables",
    titleJa: 'イソップ物語',
    author: 'Aesop',
    level: 'A2',
    blurb: '1話が数行〜十数行と短く、日本人にも馴染み深い。最初の1冊に最適。',
  },
  {
    id: 18442,
    slug: 'fifty-famous-stories',
    title: 'Fifty Famous Stories Retold',
    titleJa: '有名な物語50選',
    author: 'James Baldwin',
    level: 'A2',
    blurb: '学習者向けに平易に書き直された逸話集。英語の易しさは随一。',
  },
  {
    id: 14838,
    slug: 'peter-rabbit',
    title: 'The Tale of Peter Rabbit',
    titleJa: 'ピーターラビットのおはなし',
    author: 'Beatrix Potter',
    level: 'A2',
    blurb: '非常に短く語彙も平易。1セッションで完走できる。',
  },
  {
    id: 33051,
    slug: 'momotaro',
    title: 'Momotaro, or Little Peachling',
    titleJa: '桃太郎',
    author: 'David Thompson (trans.)',
    level: 'A2',
    blurb: 'おなじみ桃太郎の英訳。短く平易で、話を知っている安心感がある。',
  },
  {
    id: 55,
    slug: 'wizard-of-oz',
    title: 'The Wonderful Wizard of Oz',
    titleJa: 'オズの魔法使い',
    author: 'L. Frank Baum',
    level: 'A2–B1',
    blurb: '平易で現代寄りの語彙・短い文。物語で読み進めやすい。',
  },
  {
    id: 271,
    slug: 'black-beauty',
    title: 'Black Beauty',
    titleJa: '黒馬物語',
    author: 'Anna Sewell',
    level: 'B1',
    blurb: '章が短い一話完結型。情景描写が素直。',
  },
  {
    id: 902,
    slug: 'happy-prince',
    title: 'The Happy Prince, and Other Tales',
    titleJa: '幸福な王子',
    author: 'Oscar Wilde',
    level: 'B1',
    blurb: '短編集で長さは手頃。語彙はやや文学的。',
  },
  {
    id: 4018,
    slug: 'japanese-fairy-tales',
    title: 'Japanese Fairy Tales',
    titleJa: '日本のおとぎ話集',
    author: 'Yei Theodora Ozaki',
    level: 'B1',
    blurb: '桃太郎・かぐや姫・舌切り雀など多数収録。やや文語的だが内容は馴染み深い。',
  },
  {
    id: 11,
    slug: 'alice-in-wonderland',
    title: "Alice's Adventures in Wonderland",
    titleJa: '不思議の国のアリス',
    author: 'Lewis Carroll',
    level: 'B1',
    blurb: '言葉遊び・古風な表現が多く少し背伸び。話を知っていれば読みやすい。',
  },
]
