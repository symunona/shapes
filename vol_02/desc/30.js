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

let wordMap;

define(["frame", "underscore", "p5"], (c, _, p5) => {
  "use strict";

  var css = `
    .letter { cursor: pointer }
    .letter:hover { color: ${c.c.p[8]}; }
    .letter.active { color: ${c.c.b}; background: ${c.c.p[6]}; }
    .letter.selected { color: ${c.c.p[10]}; }
  `;
  var style = document.createElement("style");

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  document.getElementsByTagName("head")[0].appendChild(style);

  function HunThree(p) {
    p.properties = _.extend({}, HunThree.prototype.properties);

    p.setup = async function () {
      const words = generateAllWords();
      console.log(
        `all: ${words.length} - massal ${consonants.length} - magan ${vowels.length}`
      );

      console.log(words.join("\n"));

      c.info(30, "hun3");
      const w = document.getElementById("shape-wrapper");
      w.style.width = "640px";
      w.style.fontSize = "32px";

      const hunExisting = await getJson("./desc/hun3x.json");
      const existingWordMap = {};
      hunExisting.forEach(({ word, is, comment }) => {
        existingWordMap[word] = { is, comment };
      });
      wordMap = existingWordMap;

      const containers = {
        c1: document.createElement("div"),
        v: document.createElement("div"),
        c2: document.createElement("div"),
      };

      

      const selected = {
        c1: null,
        v: null,
        c2: null,
      };

      const letterMap = generateLetterMap();

      console.log(letterMap)

      Object.keys(containers).forEach((cKey) => {
        const container = containers[cKey];
        container.style.width = "25%";
        container.style.display = "inline-block";
        cvmap[cKey].forEach((letter) => {
          const letterContainer = document.createElement("div");
          letterContainer.innerText = letter;
          letterContainer.id = cKey + letter;
          letterContainer.classList.add("letter");
          letterContainer.onclick = () => {
            if (!selected[cKey]) {
              letterContainer.classList.add("selected");
              selected[cKey] = letter;
            } else {
              // Toggl
              if (selected[cKey] === letter) {
                letterContainer.classList.remove("selected");
                selected[cKey] = null;
              } else {
                const old = document.querySelector("#" + cKey + selected[cKey]);
                console.log("." + cKey + selected[cKey]);
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
        w.append(container);
      });

      console.log(existingWordMap);
    };
    // draw(){
    //     textSize(32);
    //     text('word', 10, 30);
    //     fill(0, 102, 153);

    // }
  }
  HunThree.prototype.properties = {
    id: "30hun",
    inputs: {},
  };

  return HunThree;

  function generateLetterMap() {
    const letterMap = {
      c1: { },
      v: {  },
      c2: { },
    };

    // c1 fixed
    consonants.forEach(c1=>{
        const {letterSet1Used, letterSet2Used} = getUsed2(c1, 0, vowels, 1, consonants, 2)
        letterMap.c1[c1] = {v: letterSet1Used, c2: letterSet2Used}
    })

    // c2 fixed
    consonants.forEach(c2=>{
        const {letterSet1Used, letterSet2Used} = getUsed2(c2, 2, vowels, 1, consonants, 0)
        letterMap.c2[c2] = {v: letterSet1Used, c1: letterSet2Used}
    })

    // v fixed
    vowels.forEach(v=>{
        const {letterSet1Used, letterSet2Used} = getUsed2(v, 1, consonants, 0, consonants, 2)
        letterMap.v[v] = {c1: letterSet1Used, c2: letterSet2Used}
    })

    return letterMap;
  }

  function getUsed2(fixedLetter, index, letterArray1, index1, letterArray2, index2){
    const letterSet1Used = {}
    const letterSet2Used = {}
    letterArray1.forEach(l1 => {
        letterSet1Used[l1] = { fixed: {}, count: 0 }
        const secondLetterUsed = letterArray2.forEach(l2 => {
            const word = getWord(fixedLetter, index, l1, index1, l2, index2)
            if (wordMap[word]?.is){
                letterSet1Used[l1].count ++
                letterSet1Used[l1].fixed[l2] = true
                letterSet2Used[l2] = letterSet2Used[l2] || {fixed: {}, count: 0}
                letterSet2Used[l2].fixed[l2] = true
                letterSet2Used[l2].count ++
            }
        })
    })
    return {
        letterSet1Used,
        letterSet2Used
    }
  }
  function getWord(letter1, index1, letter2 , index2, letter3, index3){
    const word = []
    word[index1] = letter1
    word[index2] = letter2
    word[index3] = letter3
    return word.join('')
  }

  function highlight(selected) {
    document
      .querySelectorAll(".letter")
      .forEach((el) => el.classList.remove("active"));
    if (selected.c1 && !selected.v && !selected.c2) {
      const vActive = vowels.filter((v) =>
        consonants.find((c2) => {
          const word = selected.c1 + v + c2;
          console.log(word, wordMap[word]?.is);
          return wordMap[word]?.is;
        })
      );
      console.log("vActive", vActive);
      vActive.forEach((v) => {
        document.getElementById("v" + v).classList.add("active");
      });
    }
    Object.keys(selected).forEach((key, i) => {
      if (selected[key]) {
        // The other two should
      }
    });
  }

  function generateAllWords() {
    const words = [];
    consonants.forEach((c1) =>
      vowels.forEach((v) => consonants.forEach((c2) => words.push(c1 + v + c2)))
    );
    return words;
  }
});

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
