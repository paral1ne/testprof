const headElem = document.getElementById("head");
const buttonsElem = document.getElementById("buttons");
const pagesElem = document.getElementById("pages");

//Класс, который представляет сам тест
class Quiz {
  constructor(type, questions, results) {
    //Тип теста: 1 - классический тест с правильными ответами, 2 - тест без правильных ответов
    this.type = type;

    //Массив с вопросами
    this.questions = questions;

    //Массив с возможными результатами
    this.results = results;

    //Количество набранных очков
    this.score = 0;

    //Номер результата из массива
    this.result = 0;

    //Номер текущего вопроса
    this.current = 0;
  }

  Click(index) {
    //Добавляем очки
    let value = this.questions[this.current].Click(index);
    this.score += value;

    let correct = -1;

    //Если было добавлено хотя одно очко, то считаем, что ответ верный
    if (value >= 1) {
      correct = index;
    } else {
      //Иначе ищем, какой ответ может быть правильным
      for (let i = 0; i < this.questions[this.current].answers.length; i++) {
        if (this.questions[this.current].answers[i].value >= 1) {
          correct = i;
          break;
        }
      }
    }

    this.Next();

    return correct;
  }

  //Переход к следующему вопросу
  Next() {
    this.current++;

    if (this.current >= this.questions.length) {
      this.End();
    }
  }

  //Если вопросы кончились, этот метод проверит, какой результат получил пользователь
  End() {
    for (let i = 0; i < this.results.length; i++) {
      if (this.results[i].Check(this.score)) {
        this.result = i;
      }
    }
  }
}

//Класс, представляющий вопрос
class Question {
  constructor(text, answers) {
    this.text = text;
    this.answers = answers;
  }

  Click(index) {
    return this.answers[index].value;
  }
}

//Класс, представляющий ответ
class Answer {
  constructor(text, value) {
    this.text = text;
    this.value = value;
  }
}

//Класс, представляющий результат
class Result {
  constructor(text, value) {
    this.text = text;
    this.value = value;
  }

  //Этот метод проверяет, достаточно ли очков набрал пользователь
  Check(value) {
    if (this.value <= value) {
      return true;
    } else {
      return false;
    }
  }
}

//Массив с результатами
const results = [
  new Result(
    "Слесарь на уровне мастера гаек – замешан в загадочном исчезновении б/у антифриза!",
    0
  ),
  new Result("Слесарь с мастерством еще не рвачок но уже не салага!", 2),
  new Result(
    "Слесарь с мудростью – знает, что часики сами по себе не появятся!",
    4
  ),
  new Result(
    "Наивысший уровень слесарного искусства – Прежде чем критиковать ремонт проверь нет ли твоей фамилии в заказ-наряде!",
    6
  ),
];

//Массив с вопросами
const questions = [
  new Question("Какое слово может закричать слесарь в любой момент?", [
    new Answer("Авария!", 0),
    new Answer("Молоток!", 0),
    new Answer("БеБе!", 1),
    new Answer("Инструмент!", 0),
  ]),
  new Question(
    "Что специалист по ремонту двигателей делает в смотровой канаве?",
    [
      new Answer("Потерял ключ на 19", 0),
      new Answer("Усердно трудится", 0),
      new Answer("Там запрятана сиська пива", 1),
      new Answer("Подальше от начальства", 0),
    ]
  ),

  new Question("В какой ситуации слесарь может внезапно закричать БЛЯДЬ!?", [
    new Answer("При получении неожиданного удара", 0),
    new Answer("Вне зависимости от ситуации", 1),
    new Answer("Когда забывает необходимый инструмент", 0),
    new Answer("При выполнении сложной задачи", 0),
  ]),

  new Question("О чем думает человек, обходящий воображаемую скамейку?", [
    new Answer("О финансовом благополучии", 1),
    new Answer("О погоде и текущей температуре", 0),
    new Answer("О своих планах на оставшуюся часть дня", 0),
    new Answer("О последних новостях или событиях", 0),
  ]),

  new Question(
    "Что может стать причиной того что вас трясет как в клипе Fatboy Slim - Ya Mama?",
    [
      new Answer("Ритмичный бас и ударные в музыке", 0),
      new Answer("Неучтивый слесарь дернул дверную ручку несколько раз", 1),
      new Answer("Рвачи выпили всю воду из бойлера", 0),
      new Answer("Острая нехватка нормочасиков", 0),
    ]
  ),

  new Question("Что из перечисленного имеет наивысшую ценность?", [
    new Answer("Шариковая ручка", 0),
    new Answer("Балончик Forch", 0),
    new Answer("Канистра б/у антифриза", 1),
    new Answer("Распылитель форсунки", 0),
  ]),
];

//Сам тест
const quiz = new Quiz(1, questions, results);

Update();

//Обновление теста
function Update() {
  //Проверяем, есть ли ещё вопросы
  if (quiz.current < quiz.questions.length) {
    //Если есть, меняем вопрос в заголовке
    headElem.innerHTML = quiz.questions[quiz.current].text;

    //Удаляем старые варианты ответов
    buttonsElem.innerHTML = "";

    //Создаём кнопки для новых вариантов ответов
    for (let i = 0; i < quiz.questions[quiz.current].answers.length; i++) {
      let btn = document.createElement("button");
      btn.className = "button";

      btn.innerHTML = quiz.questions[quiz.current].answers[i].text;

      btn.setAttribute("index", i);

      buttonsElem.appendChild(btn);
    }

    //Выводим номер текущего вопроса
    pagesElem.innerHTML = quiz.current + 1 + " / " + quiz.questions.length;

    //Вызываем функцию, которая прикрепит события к новым кнопкам
    Init();
  } else {
    //Если это конец, то выводим результат
    buttonsElem.innerHTML = "";
    headElem.innerHTML = quiz.results[quiz.result].text;
    pagesElem.innerHTML = "Очки: " + quiz.score;
  }
}

function Init() {
  //Находим все кнопки
  let btns = document.getElementsByClassName("button");

  for (let i = 0; i < btns.length; i++) {
    //Прикрепляем событие для каждой отдельной кнопки
    //При нажатии на кнопку будет вызываться функция Click()
    btns[i].addEventListener("click", function (e) {
      Click(e.target.getAttribute("index"));
    });
  }
}

function Click(index) {
  //Получаем номер правильного ответа
  let correct = quiz.Click(index);

  //Находим все кнопки
  let btns = document.getElementsByClassName("button");

  //Делаем кнопки серыми
  for (let i = 0; i < btns.length; i++) {
    btns[i].className = "button button_passive";
  }

  //Если это тест с правильными ответами, то мы подсвечиваем правильный ответ зелёным, а неправильный - красным
  if (quiz.type == 1) {
    if (correct >= 0) {
      btns[correct].className = "button button_correct";
    }

    if (index != correct) {
      btns[index].className = "button button_wrong";
    }
  } else {
    //Иначе просто подсвечиваем зелёным ответ пользователя
    btns[index].className = "button button_correct";
  }

  //Ждём секунду и обновляем тест
  setTimeout(Update, 1000);
}
