const solveBtn = document.getElementById('solveBtn');

solveBtn.addEventListener('click', solve);

const roles = ['knight', 'liar', 'human'];

function solve() {
  const statements = {
    A: document.getElementById('a').value.trim(),
    B: document.getElementById('b').value.trim(),
    C: document.getElementById('c').value.trim()
  };

  const names = ['A', 'B', 'C'];
  let results = [];

  // Перебір всіх перестановок ролей
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      for (let k = 0; k < 3; k++) {
        if (new Set([i, j, k]).size !== 3) continue; // уникнути однакових ролей
        const roleMap = { A: roles[i], B: roles[j], C: roles[k] };

        if (isConsistent(statements, roleMap)) {
          results.push(`${roleMap.A} – A, ${roleMap.B} – B, ${roleMap.C} – C`);
        }
      }

  document.getElementById('result').innerText =
    results.length ? results.join('\n') : 'Жодної узгодженої комбінації не знайдено.';
}

function evaluate(statement, roleMap, speaker) {
  const role = roleMap[speaker];
  const saysTrue = interpretStatement(statement, roleMap);

  if (role === 'knight') return saysTrue === true;
  if (role === 'liar') return saysTrue === false;
  return true; // human може казати правду або брехати
}

function isConsistent(statements, roleMap) {
  return ['A', 'B', 'C'].every(person =>
    evaluate(statements[person], roleMap, person)
  );
}

// Спрощений аналіз висловлювань
function interpretStatement(text, roles) {
  text = text.toLowerCase();

  if (text.includes('я звичайна')) {
    return roles[text[0]] === 'human';
  } else if (text.includes('я не є звичайною')) {
    return roles[text[0]] !== 'human';
  } else if (text.includes('це правда')) {
    return roles['A'] === 'human'; // B каже про A
  }

  return null;
}
