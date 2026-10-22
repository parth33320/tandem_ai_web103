-- db/seed.sql

ALTER TABLE words ADD COLUMN IF NOT EXISTS fun_fact TEXT;
ALTER TABLE words ADD COLUMN IF NOT EXISTS jp_meaning_note TEXT;
ALTER TABLE words ADD COLUMN IF NOT EXISTS zh_meaning_note TEXT;

UPDATE words SET
  jp_meaning_note = 'In Japanese, tegami means letter/epistle, originating from paper in hand.',
  zh_meaning_note = 'In Chinese, shǒuzhǐ literally means toilet paper.',
  fun_fact = 'Handwriting a letter in Japan is tegami, but do not ask for tegami in China!'
WHERE characters = '手紙';

UPDATE words SET
  jp_meaning_note = 'In Japanese, benkyō means studying or learning.',
  zh_meaning_note = 'In Chinese, miǎnqiǎng means forced, reluctant, or unconvincing.',
  fun_fact = 'Studying hard in Japanese feels like forcing yourself in Chinese!'
WHERE characters = '勉強';

UPDATE words SET
  jp_meaning_note = 'In Japanese, kisha refers specifically to a steam train or locomotive.',
  zh_meaning_note = 'In Chinese, qìchē refers to a motor automobile or car.',
  fun_fact = 'Both words involve powered engines, but one runs on tracks and the other on roads!'
WHERE characters = '汽車';

UPDATE words SET
  jp_meaning_note = 'In Japanese, aijin means lover or mistress.',
  zh_meaning_note = 'In Chinese, àiren means spouse, husband, or wife.',
  fun_fact = 'Calling your spouse aijin in Japan might cause a serious misunderstanding!'
WHERE characters = '愛人';

UPDATE words SET
  jp_meaning_note = 'In Japanese, ōya means landlord or house owner.',
  zh_meaning_note = 'In Chinese, dàjiā means everybody or everyone.',
  fun_fact = 'In Japanese it is your landlord, while in Chinese it refers to everybody!'
WHERE characters = '大家';
