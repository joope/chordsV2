function init(){ 
  const chords = document.querySelectorAll('pre > span');
  const chordString = [];
  chords.forEach(c => chordString.push(c.textContent));

  const minPatternLength = 2;
  const maxPatternLength = 16;

  let result = [];
  let current = [];
  let matchLength = 0;
  let repeatLength = 0;

  for(let i = 0; i < chordString.length; i++) {
    if (repeatLength === 0){
      current.push(chordString[i]);
    }

    // Wait until there's enought items to compare
    if (current.length < minPatternLength) continue;

    // Break if we are at the end
    if (i + current.length > chordString.length) {
      result.push({
        chords: current.join(' '),
        repeats: repeatLength,
      });
      break;
    }

    // Add strings to current for comparison
    for (let c = 0; c < current.length; c++) {
        if (current[c] === chordString[c + i + 1]) {
          matchLength++;
        } else {
          break;
        }
    };

    // If matches are found move pointer ahead
    if (matchLength > 0) {
      i = i + matchLength - 1;
      matchLength = 0;
      repeatLength++;
      continue;
    }

    if (matchLength === 0 && repeatLength > 0) {
      result.push({
        chords: current.join(' '),
        repeats: repeatLength,
      });
      repeatLength = 0;
      current = [];
      continue;
    }
    
    if (matchLength === 0 && repeatLength === 0 && current.length === maxPatternLength) {
      i = i - current.length + 1;
      result.push({
        chords: current[0],
        repeats: repeatLength,
      });
      current = [];
      continue;
    }
  }

  let noRepeats = [];

  // Collect chords without repeat to their own groups
  const results = result.reduce((acc, res) => {
    if (res.repeats > 0) {
      if (noRepeats.length > 0) {
        acc.push({
          chords: noRepeats.join(' '),
          repeats: 0,
        });
        noRepeats = [];
      } 
      acc.push(res);
    } else {
      noRepeats.push(res.chords);
    }
    return acc;
  }, []);

  showResults(results);
}

function showResults(result){
  const results = document.createElement('ul');
  results.appendChild(document.querySelector('header h1'));
  results.setAttribute('id', 'better-chords');
  results.style.cssText = "box-sizing: border-box; width: 100%;background-color: whitesmoke;font-size: 4vh;color: black;text-align: center;padding: 1vh;list-style: none;font-weight: 600;word-spacing: 3vh;line-height: 6vh; margin-top: 12px;";

  result.forEach(c => {
    const chordGroup = document.createElement('li');
    chordGroup.style.borderTop = "solid 1px lightgrey";
    const repeats = document.createElement('span');
    repeats.style.cssText = "color: grey; font-weight: 400;"
    chordGroup.textContent = c.chords;
    if (c.repeats > 0) {
      repeats.textContent = ' x' + (c.repeats + 1);
      chordGroup.appendChild(repeats);
    }
    results.appendChild(chordGroup);
  });

  document.body.insertBefore(results, document.body.firstChild);
}

function startWhenContentLoaded() {
  if (document.querySelector('pre')){
    init();
    const buttons = document.querySelectorAll('span > button');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        console.log('click');
        init();
      });
    })
  } else {
    setTimeout(startWhenContentLoaded, 100);
  }
}

startWhenContentLoaded();
