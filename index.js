const score = document.querySelector('.score'),
       start = document.querySelector('.start'),
        gameArea = document.querySelector('.gameArea'),
        car = document.createElement('div'),
        music = document.createElement('audio');

car.classList.add('car');

start.addEventListener('click', startGame);

document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3,
};

function getQuantityElements(heightElement){
    return document.documentElement.clientHeight / heightElement + 1;
}

function startGame(){
    start.classList.add('hide');
    gameArea.classList.remove('hide');
    gameArea.innerHTML = "";
    car.style.left = '125px';
    car.style.top = 'auto';
    car.style.bottom = '10px';
    car.style.transform = "rotate(0)";
    for(let i = 0; i < getQuantityElements(100); i++){
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }

    for(let i = 0; i < getQuantityElements(100 * setting.traffic); i++){
        const enemy = document.createElement('div');
        // генерація суперників
        let enemyImg = Math.floor(Math.random() * 5) + 1;
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        // для різних моделей машинок
        enemy.style.background = `transparent url(./img/enemy${enemyImg}.png) center / cover no-repeat`;
        gameArea.appendChild(enemy);
    }

    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(car);
    // car.style.transform = 'rotate(0deg)';
    music.setAttribute('autoplay', true);
    music.setAttribute('src', './audio.mp3');
    // для відображення муз. панелі
    // music.setAttribute('controls', true);
    // gameArea.appendChild(music);
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame(){
    moveRoad();
    moveEnemy();
    if(setting.start){
        score.classList.remove('hide');
        setting.score += setting.speed;
        score.textContent = "Бали: " + setting.score;
        if(keys.ArrowLeft && setting.x > 0){
            setting.x -= setting.speed;
            car.style.transform = "rotate(-15deg)";
        } 

        if(keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)){
            setting.x += setting.speed;
            car.style.transform = "rotate(15deg)";
        } 

        if(keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)){
            setting.y += setting.speed;
            car.style.transform = "rotate(0)";
        }

        if(keys.ArrowUp && setting.y > 0){
            setting.y -= setting.speed;
            car.style.transform = "rotate(0)";
        }
        
        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
        requestAnimationFrame(playGame);
    }
}

function startRun(event){
    event.preventDefault();
    keys[event.key] = true;
}

function stopRun(){
    event.preventDefault();
    keys[event.key] = false;
}

function moveRoad(){
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(line){
        line.y += setting.speed;
        line.style.top = line.y + 'px';

        if(line.y >= document.documentElement.clientHeight){
            line.y = -100;
        }
    });
}

 function moveEnemy(){
     let enemy = document.querySelectorAll('.enemy');

     enemy.forEach(function(item){
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if(carRect.top < enemyRect.bottom &&
            carRect.right > enemyRect.left &&
            carRect.left < enemyRect.right &&
            carRect.bottom > enemyRect.top){
                setting.start = false;
                console.warn('Ой, ДТП!');
                start.classList.remove('hide');
                //gameArea.classList.add('hide');
        }
        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';
        if(item.y >= document.documentElement.clientHeight){
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
     });
 }