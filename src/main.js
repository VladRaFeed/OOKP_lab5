// ======= Стратегії ролей =======
class RoleStrategy {
  evaluate(statementTruth) {
    throw new Error("Метод має бути реалізований");
  }
}

class KnightStrategy extends RoleStrategy {
  evaluate(statementTruth) {
    return statementTruth === true;
  }
}

class LiarStrategy extends RoleStrategy {
  evaluate(statementTruth) {
    return statementTruth === false;
  }
}

class HumanStrategy extends RoleStrategy {
  evaluate(statementTruth) {
    return true; // може казати правду або брехати
  }
}

// ======= Інтерпретатор висловлювань =======
class StatementInterpreter {
  interpret(text, roles) {
    text = text.toLowerCase();

    if (text.includes('я звичайна')) {
      return roles[text[0]] === 'Людина';
    } else if (text.includes('я не є звичайною')) {
      return roles[text[0]] !== 'Людина';
    } else if (text.includes('це правда')) {
      return roles['A'] === 'Людина'; // наприклад: B каже про A
    }

    return null;
  }
}

// ======= Оцінювач (Evaluator) =======
class Evaluator {
  constructor(strategies, interpreter) {
    this.strategies = strategies;
    this.interpreter = interpreter;
  }

  evaluate(person, statement, roleMap) {
    const role = roleMap[person];
    const strategy = this.strategies[role];
    const saysTrue = this.interpreter.interpret(statement, roleMap);
    return strategy.evaluate(saysTrue);
  }
}

// ======= Основний розв’язувач (Solver) =======
class Solver {
  constructor(statements) {
    this.statements = statements;
    this.roles = ['Лицар', 'Брехун', 'Людина'];
    this.names = ['A', 'B', 'C'];

    this.strategies = {
      'Лицар': new KnightStrategy(),
      'Брехун': new LiarStrategy(),
      'Людина': new HumanStrategy()
    };

    this.interpreter = new StatementInterpreter();
    this.evaluator = new Evaluator(this.strategies, this.interpreter);
  }

  solve() {
    const results = [];

    // Перебір усіх унікальних комбінацій ролей
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        for (let k = 0; k < 3; k++) {
          if (new Set([i, j, k]).size !== 3) continue;

          const roleMap = {
            A: this.roles[i],
            B: this.roles[j],
            C: this.roles[k]
          };

          if (this.isConsistent(roleMap)) {
            results.push(`${roleMap.A} - A, ${roleMap.B} - B, ${roleMap.C} - C`);
          }
        }

    return results.length ? results.join('\n') : 'Жодної узгодженої комбінації не знайдено.';
  }

  isConsistent(roleMap) {
    return this.names.every(name =>
      this.evaluator.evaluate(name, this.statements[name], roleMap)
    );
  }
}

// ======= Запуск після натискання кнопки =======
document.getElementById('solveBtn').addEventListener('click', () => {
  const statements = {
    A: document.getElementById('a').value.trim(),
    B: document.getElementById('b').value.trim(),
    C: document.getElementById('c').value.trim()
  };

  const solver = new Solver(statements);
  const result = solver.solve();

  document.getElementById('result').innerText = result;
});

// Тест для голосового

const speak = document.getElementById('speak');
const textArea = document.getElementById('textarea');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
speak.addEventListener('click', () => {
  recognition.start();
  textArea.innerHTML = 'Speak...';
});
recognition.onresult = function(e) {
  console.log(e);
  const result = e.results[0][0].transcript;
  textArea.innerHTML = result;
}
