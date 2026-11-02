# Nákupná brzda

Jednoduchý doplnok do Chromu, ktorý pomáha spomaliť impulzívne nakupovanie. Po kliknutí na rozpoznané nákupné tlačidlo (napríklad „Pridať do košíka“, „Kúpiť“ alebo „Buy now“) zobrazí otázky na zamyslenie: naozaj tú vec potrebuješ, máš na ňu miesto a využiješ ju aj o mesiac? Potom sa môžeš rozhodnúť, či v nákupe pokračuješ.

## Ako ho nainštalovať do Chromu

1. Na [stránke repozitára](https://github.com/Hurtis/spend-brake) klikni na **Code → Download ZIP** a stiahnutý ZIP rozbaľ.
2. V Chrome otvor adresu `chrome://extensions`.
3. Vpravo hore zapni **Režim pre vývojárov** (Developer mode).
4. Klikni na **Načítať rozbalené** (Load unpacked).
5. Vyber rozbalený priečinok, v ktorom je priamo súbor `manifest.json`.
6. Obnov už otvorené stránky obchodov, aby na nich doplnok začal fungovať.

Priečinok s doplnkom si ponechaj na disku. Na inštaláciu nepotrebuješ nič kompilovať ani inštalovať ďalšie nástroje.

## Používanie

Doplnok je po inštalácii zapnutý. Cez ikonu rozšírení (puzzle) v Chrome otvor **Nakupna Brzda**, kde ho môžeš zapnúť alebo vypnúť. Pre rýchly prístup si jeho ikonu pripni na panel.

Ide o prvú verziu: nákupné tlačidlá rozpoznáva podľa textu, preto nemusí zachytiť každý nákup na každom e-shope. Zoznam rozpoznávaných textov a otázky nájdeš v súbore `config.js`.

Po aktualizácii súborov klikni pri doplnku na `chrome://extensions` na **Znovu načítať** a obnov aj stránku obchodu.
