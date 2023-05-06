// Three letter words in Hungarian
const vowels = [
  "a",
  "á",
  "e",
  "é",
  "i",
  "í",
  "o",
  "ó",
  "ö",
  "ő",
  "u",
  "ú",
  "ü",
  "ű",
];

const consonants = [
  "b",
  "c",
  "cs",
  "d",
  "f",
  "g",
  "gy",
  "h",
  "j",
  "k",
  "l",
  "ly",
  "m",
  "n",
  "ny",
  "p",
  "r",
  "s",
  "sz",
  "t",
  "ty",
  "v",
  "z",
  "zs",
];

const cvmap = { c1: consonants, v: vowels, c2: consonants };

const selected = {
  c1: null,
  v: null,
  c2: null,
};

const halfFont = 16

define(["frame", "underscore", "p5"], (c, _, p5) => {
  "use strict";

  let wordMap;
  let letterMap;
  let initMap;
  let containers;
  let p;

  let css = `
    #shape-main { width: ${c.w}px; font-size: ${2 * halfFont}px; position: relative; }
    #shape-main canvas { width: ${c.w}px; position: absolute; top: 0; left: 0; z-index: 1 }
    .all-letter-container { width: ${c.w}px; position: absolute; top: 0; left: 0; z-index: 2 }
    .letter { cursor: pointer; text-align: left }
    .letter .count { color: ${c.c.f}; display: inline-block; width: 60px; text-align: right; }
    .letter-container { padding: 20px; width: calc( 28% - 40px ); display: inline-block; vertical-align: middle; }
    .letter:hover { color: ${c.c.p[8]}; }
    .letter.selected .ltr{ color: ${c.c.b}; background: ${c.c.p[7]}; }
    .letter.active .ltr{ color: ${c.c.b}; background: ${c.c.f}; }
  `;
  let style = document.createElement("style");

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  document.getElementsByTagName("head")[0].appendChild(style);

  function HunThree(processing) {
    p = processing
    processing.properties = _.extend({}, HunThree.prototype.properties);

    processing.setup = async function () {
      const allWords = generateAllWords();
      console.log(
        `all: ${allWords.length} - massal ${consonants.length} - magan ${vowels.length}`
      );

      // console.log(allWords.join("\n"));

      const hunExisting = await getJson("./desc/hun3x.json");
      const existingWordMap = {};

      // Stats
      const percent =
        Math.round((hunExisting.length / allWords.length) * 10000) / 100;
      c.info(
        30,
        `hun3 ex/all: ${hunExisting.length}/${allWords.length} = ${percent}%`
      );

      // Map
      hunExisting.forEach(({ word, is, comment }) => {
        existingWordMap[word] = { is, comment };
      });
      wordMap = existingWordMap;

      containers = {
        c1: document.createElement("div"),
        v: document.createElement("div"),
        c2: document.createElement("div"),
      };

      renderDom(containers);

      letterMap = generateLetterMap();
      initMap = calculateInitMap();
      showInitMap();

      p.fill('blue')
      p.circle(40, 40, 50)
    };
  }
  HunThree.prototype.properties = {
    id: "30hun",
    desc: `
Three 'letter' words in Hungarian.
Accidentally bumped into some that ended with an R
Made me do this.
Concepts like what a letter is melt trying to define it
By English standards.
${consonants.length} squared consonants
${vowels.length} vowels
Give us ${Math.pow(consonants.length, 2) * vowels.length} possible combinations.
Explore!
`,
    inputs: {},
  };

  return HunThree;

  function renderDom(containers) {
    const w = document.getElementById("shape-main");
    // w.innerHTML = ''
    const canvas = w.children[0]
    const wrapper = document.createElement('div')
    wrapper.classList.add('all-letter-container')
    w.append(wrapper)

    // Render Letters DOM
    Object.keys(containers).forEach((cKey) => {
      const container = containers[cKey];
      container.classList.add("letter-container");
      cvmap[cKey].forEach((letter) => {
        const letterContainer = document.createElement("div");
        letterContainer.innerHTML = `<span class="ltr">${letter}${letter.length === 1 ? "&nbsp" : ""
          }</span> <span class="count"></span>`;
        letterContainer.id = cKey + letter;
        letterContainer.classList.add("letter");
        letterContainer.onclick = (e) => {
          e.stopPropagation()
          if (!selected[cKey]) {
            letterContainer.classList.add("selected");
            selected[cKey] = letter;
          } else {
            // Toggl
            if (selected[cKey] === letter) {
              letterContainer.classList.remove("selected");
              selected[cKey] = null;
              p.clear(c.c.b)
            } else {
              const old = document.querySelector("#" + cKey + selected[cKey]);
              // console.log("." + cKey + selected[cKey]);
              old.classList.remove("selected");
              letterContainer.classList.add("selected");
              selected[cKey] = letter;
            }
          }

          // Narrow the rest:
          highlight(selected);
        };
        container.appendChild(letterContainer);
      });
      wrapper.append(container);
    });
    canvas.style.width = c.w + 'px'
    canvas.style.height = wrapper.clientHeight + 'px'
    w.style.height = wrapper.clientHeight + 'px';
    p.createCanvas(c.w, wrapper.clientHeight)
  }

  /**
   * Creates all the possible combinations when each respective letter is fixed.
   * @returns Object
   */
  function generateLetterMap() {
    const letterMap = {
      c1: {},
      v: {},
      c2: {},
    };

    // c1 fixed
    consonants.forEach((c1) => {
      const { letterSet1Used, letterSet2Used } = getUsed2(
        c1,
        0,
        vowels,
        1,
        consonants,
        2
      );
      letterMap.c1[c1] = { v: letterSet1Used, c2: letterSet2Used };
    });

    // c2 fixed
    consonants.forEach((c2) => {
      const { letterSet1Used, letterSet2Used } = getUsed2(
        c2,
        2,
        vowels,
        1,
        consonants,
        0
      );
      letterMap.c2[c2] = { v: letterSet1Used, c1: letterSet2Used };
    });

    // v fixed
    vowels.forEach((v) => {
      const { letterSet1Used, letterSet2Used } = getUsed2(
        v,
        1,
        consonants,
        0,
        consonants,
        2
      );
      letterMap.v[v] = { c1: letterSet1Used, c2: letterSet2Used };
    });

    return letterMap;
  }

  /**
   * Returns all the individual letter counts per character.
   */
  function calculateInitMap() {
    const initMap = {
      c1: {},
      v: {},
      c2: {},
    };
    consonants.forEach((c) => {
      initMap.c1[c] = Object.keys(wordMap).filter(
        (word) => splitWord(word)[0] === c
      ).length;
      initMap.c2[c] = Object.keys(wordMap).filter(
        (word) => splitWord(word)[2] === c
      ).length;
    });

    vowels.forEach((v) => {
      initMap.v[v] = Object.keys(wordMap).filter(
        (word) => splitWord(word)[1] === v
      ).length;
    });
    return initMap;
  }

  /**
   * As Hungarian has multi letter sounds, splitting is not obvious.
   * @param {String} word
   * @returns {Array<HungarianCharacter>}
   */
  function splitWord(word) {
    const vowel = vowels.find((vowel) => word.indexOf(vowel) > -1);
    const array = word.split(vowel);
    return [array[0], vowel, array[1]];
  }

  /**
   * Counts the letters used if we fix one letter out of three.
   *
   * @param {Character} fixedLetter
   * @param {Integer} index - which letter is fixed
   * @param {Array<Character>} letterArray1
   * @param {Integer} index1 - where letter1 goes in the word
   * @param {Array<Character>} letterArray2
   * @param {Integer} index2 - where letter2 goes in the word
   * @returns
   */
  function getUsed2(
    fixedLetter,
    index,
    letterArray1,
    index1,
    letterArray2,
    index2
  ) {
    const letterSet1Used = {};
    const letterSet2Used = {};
    letterArray1.forEach((l1) => {
      letterSet1Used[l1] = {};
      const secondLetterUsed = letterArray2.forEach((l2) => {
        const word = getWord(fixedLetter, index, l1, index1, l2, index2);

        if (wordMap[word]?.is) {
          letterSet1Used[l1][l2] = letterSet1Used[l1][l2] || 0;
          letterSet1Used[l1][l2]++;
          if (!letterSet2Used[l2]) {
            letterSet2Used[l2] = {};
          }
          letterSet2Used[l2][l1] = letterSet2Used[l2][l1] || 0;
          letterSet2Used[l2][l1]++;
        }
      });
    });
    return {
      letterSet1Used,
      letterSet2Used,
    };
  }

  /**
   * Builds a word if we provide the letters and the indexes.
   *
   * @param {Letter} letter1
   * @param {*} index1
   * @param {*} letter2
   * @param {*} index2
   * @param {*} letter3
   * @param {*} index3
   * @returns
   */
  function getWord(letter1, index1, letter2, index2, letter3, index3) {
    const word = [];
    word[index1] = letter1;
    word[index2] = letter2;
    word[index3] = letter3;
    return word.join("");
  }

  /**
   * Display the highlights, actives, and counts.
   * It minds which combinations are currently available.
   * @param {*} selected
   */
  function highlight(selected) {
    // Clear
    document.querySelectorAll(".letter").forEach((el) => {
      el.classList.remove("active");
      el.children[1].innerText = "";
    });

    // Reset
    if (!selected.c1 && !selected.v && !selected.c2) {
      showInitMap();
    }

    if (selected.c1 && !selected.v && !selected.c2) {
      highlightSet("v", letterMap.c1[selected.c1].v, { key: 'c1', sound: selected.c1 });
      highlightSet("c2", letterMap.c1[selected.c1].c2);
    }

    if (selected.v && !selected.c1 && !selected.c2) {
      highlightSet("c1", letterMap.v[selected.v].c1, { key: 'v', sound: selected.v, rev: true });
      highlightSet("c2", letterMap.v[selected.v].c2, { key: 'v', sound: selected.v });
    }

    if (selected.c2 && !selected.v && !selected.c1) {
      highlightSet("v", letterMap.c2[selected.c2].v, { key: 'c2', sound: selected.c2, rev: true });
      highlightSet("c1", letterMap.c2[selected.c2].c1);
    }

    if (selected.c1 && selected.v && !selected.c2) {
      highlightSet("c2", letterMap.c1[selected.c1].v[selected.v], { key: 'v', sound: selected.v });
    }

    if (selected.c1 && !selected.v && selected.c2) {
      highlightSet("v", letterMap.c1[selected.c1].c2[selected.c2], { key: 'c1', sound: selected.c1 });
      highlightSet("v", letterMap.c1[selected.c1].c2[selected.c2], { key: 'c2', sound: selected.c2, rev: true });
    }

    if (!selected.c1 && selected.v && selected.c2) {
      highlightSet("c1", letterMap.c2[selected.c2].v[selected.v], { key: 'v', sound: selected.v, rev: true });
    }
  }

  function showInitMap() {
    Object.keys(initMap).forEach((key, i) => {
      Object.keys(initMap[key]).forEach((sound) => {
        const letterContainer = document.querySelector(`#${key}${sound}`);
        letterContainer.children[1].innerText = initMap[key][sound];
      });
    });
  }

  /**
   * Does the actual highlighting of a key/set.
   * @param {Character} key
   * @param {Object<{Character: Object}>} set - which has the Characters as keys
   * @returns
   */
  function highlightSet(key, set, origin) {
    if (!set) {
      return;
    }
    let originElement;

    if (origin) {
      originElement = document.querySelector(`#${origin.key}${origin.sound} .ltr`);
    }

    Object.keys(set).forEach((sound) => {
      const letterContainer = document.querySelector(`#${key}${sound}`);
      const letterWrapperC = letterContainer.children[0]
      const counterC = letterContainer.children[1]

      if ((set[sound] && set[sound] === 1) || Object.keys(set[sound]).length) {
        letterContainer.classList.add("active");
        counterC.innerText =
          set[sound] === 1 ? "1" : Object.keys(set[sound]).length;

        if (originElement) {
          p.stroke(c.c.p[10])
          p.fill(c.c.p[10])
          if (origin.rev){
            p.line(
              originElement.offsetLeft, originElement.offsetTop + halfFont,
              letterWrapperC.offsetLeft + letterWrapperC.offsetWidth, letterWrapperC.offsetTop + halfFont)
            p.circle(letterWrapperC.offsetLeft + letterWrapperC.offsetWidth, letterWrapperC.offsetTop + halfFont, 5)
          } else {
            p.line(
              originElement.offsetLeft + originElement.offsetWidth, originElement.offsetTop + halfFont,
              letterWrapperC.offsetLeft, letterWrapperC.offsetTop + halfFont)
            p.circle(letterWrapperC.offsetLeft, letterWrapperC.offsetTop + halfFont, 5)
          }
        }
      }
    });
  }

  /**
   * All the 3 letter combination.
   * @returns {Array<String>}
   */
  function generateAllWords() {
    const words = [];
    consonants.forEach((c1) =>
      vowels.forEach((v) => consonants.forEach((c2) => words.push(c1 + v + c2)))
    );
    return words;
  }
});

/**
 * Fetch a resource from the backend. No error handling.
 * @param {String} url
 * @returns {Promise<Object>}
 */
async function getJson(url) {
  return new Promise((success) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        success(JSON.parse(this.responseText));
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  });
}
