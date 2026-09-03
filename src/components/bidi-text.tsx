/**
 * Free text that may mix Arabic with Latin.
 *
 * Listing descriptions in this market routinely read like
 * "Corolla 2021 — وارد وكالة, full service history". Rendered as a plain
 * string, the Unicode bidirectional algorithm treats the comma and the
 * digits after an Arabic run as neutral and pulls them into it, so
 * "وارد وكالة, 800V" displays as "800 ,وارد وكالةV". The text is intact in
 * the database; only its display order is wrong.
 *
 * Wrapping each Arabic run in `<bdi>` isolates it, so neighbouring
 * punctuation and numbers keep their own direction. This is display-only:
 * it adds no characters and changes nothing that is stored, copied or
 * indexed.
 */

// Arabic, Arabic Supplement/Extended-A, and the presentation forms.
const ARABIC_CHAR = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/;

/** An Arabic run: one Arabic letter, then anything but Latin letters/digits. */
const ARABIC_RUN =
  /([؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿][^A-Za-z0-9]*[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]|[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿])/g;

export default function BidiText({ text }: { text: string }) {
  if (!ARABIC_CHAR.test(text)) return <>{text}</>;

  const parts = text.split(ARABIC_RUN);
  return (
    <>
      {parts.map((part, i) =>
        ARABIC_CHAR.test(part) ? (
          <bdi key={i} lang="ar">
            {part}
          </bdi>
        ) : (
          part
        )
      )}
    </>
  );
}
