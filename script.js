// Отримання необхідних елементів з DOM
let question_field = document.querySelector('.question-block');
let answer_btn = document.querySelectorAll('.answer');
let body = document.querySelector('.colority');
let signs = ["+", "-", "*", "/"];
let start_btn = document.querySelector('.start-btn');
let start_page = document.querySelector('.start-page');
let main_page = document.querySelector('.main-page');
let result_field = document.querySelector('.result');
let timer = document.querySelector('.timer');
let timer_time = document.querySelector('.input_field');
let min_num_input = document.querySelector('.input_min_number');
let max_num_input = document.querySelector('.input_max_number');
let skip_btn = document.querySelector('.skip_btn');
let stop_btn = document.querySelector('.stop_btn');

// Ініціалізація змінних
let min_num = 1;
let max_num = 20;
let points = 0;
let total_question_count = 0;
let skips = 0;
let isCookies = false;
let cookies = document.cookie.split(';');
let cPoints;

// Перевірка наявності cookies з результатом попередньої гри
for (let i = 0; i < cookies.length; i += 1) {
    let name_value = cookies[i].split('=');
    if (name_value[0].includes('cPoints')) {
        isCookies = true;
        cPoints = name_value[1];
        result_field.innerHTML = `результат минулої гри:${cPoints} правильно`;
    }
}

// Функція для генерації випадкового числа в діапазоні
function randint(max, min) {
    return Math.round(Math.random() * (max - min) + min);
}

// Функція для отримання випадкового арифметичного знаку
function getRandomSign() {
    return signs[randint(0, 3)];
}

// Функція для перемішування елементів масиву
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) { // Цикл повторюється до тих пір, поки залишаються елементи для перемішування
        randomIndex = Math.floor(Math.random() * currentIndex); // Вибираємо елемент, що залишився
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [ // Міняємо місцями з поточним елементом
            array[randomIndex], array[currentIndex]];
    }
    return array; // Повертаємо перемішаний масив
}

// Клас для створення запитань
class Question {
    constructor() {
        let a = randint(min_num, max_num);
        let b = randint(min_num, max_num);
        let sign = getRandomSign();
        this.question = `${a} ${sign} ${b}`;
        if (sign == '+') {
            this.correct = a + b;
        }
        else if (sign == '-') {
            this.correct = a - b;
        }
        else if (sign == '*') {
            this.correct = a * b;
        }
        else if (sign == '/') {
            let answer = a / b * 100;
            this.correct = Math.round(answer) / 100;
        }
        this.answers = [
            randint(this.correct - 14, this.correct - 7),
            randint(this.correct + 1, this.correct + 7),
            randint(this.correct - 15, this.correct - 7),
            randint(this.correct - 7, this.correct - 1),
            this.correct,
        ];
        shuffle(this.answers);
        console.log(this);
    }
    // Метод для відображення запитання та відповідей
    display() {
        question_field.innerHTML = this.question;
        for (let i = 0; i < this.answers.length; i += 1) {
            answer_btn[i].innerHTML = this.answers[i];
        }
    }
}

// Максимальний час гри
let maxGameTime = 120;

// Функція для зменшення часу таймера
function changeTime() {
    timer.innerHTML = +timer.innerHTML - 1;
    if (+timer.innerHTML > 0) {
        setTimeout(changeTime, 1000);
    } else {
        displayResult();
    }
}

// Функція для відображення результатів гри
function displayResult() {
    start_page.style.display = 'flex';
    main_page.style.display = 'none';
    result_field.innerHTML = `результат минулої гри:${points} правильно, твій відсоток правильних відповідей ${Math.round(points * 100 / total_question_count)}%, пропущенно ${skips} запитань`;
    document.cookie = `cPoints=${points};max-age=${31536000000} `;
}

// Додавання обробника події для кнопки "start"
start_btn.addEventListener('click', function () {
    points = 0;
    total_question_count = 0;
    start_page.style.display = 'none';
    main_page.style.display = 'flex';

    // Налаштування таймера гри
    if (timer_time.value > 0) {
        maxGameTime = timer_time.value;
    }
    timer.innerHTML = maxGameTime;

    // Налаштування мінімального та максимального числа для запитань
    if (min_num_input.value && max_num_input.value) {
        min_num = +min_num_input.value;
        max_num = +max_num_input.value;
    }

    // Створення та відображення першого запитання
    let current_question = new Question();
    current_question.display();

    setTimeout(changeTime, 1000);

    // Додавання обробників подій для кнопок відповідей
    for (let i = 0; i < answer_btn.length; i += 1) {
        answer_btn[i].addEventListener('click', function () {
            total_question_count += 1;
        
            // Зелений, якщо правильно — червоний, якщо ні
            if (answer_btn[i].innerHTML == current_question.correct) {
                points += 1;
                answer_btn[i].style.background = 'rgb(40, 205, 40)'; // зелений
            } else {
                answer_btn[i].style.background = 'rgb(134, 0, 0)'; // червоний
            }
        
            // Через 200 мс скидаємо колір і показуємо нове питання
            setTimeout(() => {
                answer_btn[i].style.background = ''; // Повертаємо до початкового кольору
                current_question = new Question();
                current_question.display();
            }, 750);
        });
        
    }

    // Додавання обробника події для кнопки "skip"
    skip_btn.addEventListener('click', function () {
        total_question_count += 1;
        skips += 1;
        console.log('skip');
        anime({
            targets: skip_btn,
            delay: 200,
            duration: 500,
            easing: 'linear'
        }).finished.then(function () {
            current_question = new Question();
            current_question.display();
        });
    });

    // Додавання обробника події для кнопки "stop"
    stop_btn.addEventListener('click', function () {
        timer.innerHTML = 0;
        anime({
            targets: stop_btn,
            delay: 200,
            duration: 500,
            easing: 'linear'
        }).finished.then(function () {
            start_page.style.display = 'flex';
            main_page.style.display = 'none';
            displayResult();
        });
    });
});
