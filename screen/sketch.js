
const firebaseConfig = {
  apiKey: "AIzaSyAHgceZnYFj5pZ3sfLu2TtEHukc_RXGFMY",
  authDomain: "pudding-maker-f4b70.firebaseapp.com",
  databaseURL: "https://pudding-maker-f4b70-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pudding-maker-f4b70",
  storageBucket: "pudding-maker-f4b70.firebasestorage.app",
  messagingSenderId: "763928963485",
  appId: "1:763928963485:web:414d9c786ca8a4713f6774"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let stage = 0;
let clickTime = -10000;
let lastClicks = null;

let puddingSize = 1;
let targetSize = 1;

function setup() {
  createCanvas(500, 500);
  textAlign(CENTER, CENTER);
  noStroke();

  // Firebase 클릭 신호 받기
  db.ref("flower/clicks").on("value", function(snapshot) {

    let clicks = Number(snapshot.val()) || 0;

    let nextStage = clicks % 5;

    if (lastClicks !== null && clicks !== lastClicks) {
      clickTime = millis();
    }

    stage = nextStage;
    lastClicks = clicks;

  }, function(error) {
    console.error(error);
  });

  // Firebase 슬라이더 신호 받기
  db.ref("flower/slider").on("value", function(snapshot) {

    let value = snapshot.val();

    if (typeof value === "number") {
      targetSize = map(
        constrain(value, 0, 100),
        0, 100,
        0.5, 1.5
      );
    }

  }, function(error) {
    console.error(error);
  });
}

function draw() {
  background("#FFEFF4");

  // 배경 도트 무늬
  fill("#F0D2DE");

  for (let x = 15; x < width; x += 30) {
    for (let y = 15; y < height; y += 30) {
      circle(x, y, 4);
    }
  }

  // 제목
  fill("#966473");
  textSize(22);
  text("PUDDING MAKER", 250, 55);

  // 접시 그림자
  fill("#DFC0CE");
  ellipse(250, 367, 310, 55);

  // 접시
  fill("#FFFDF7");
  ellipse(250, 350, 330, 80);

  fill("#F5DCE6");
  ellipse(250, 346, 270, 55);

  // 슬라이더에 따라 부드럽게 크기 변경
  puddingSize = lerp(puddingSize, targetSize, 0.12);

  let t = (millis() - clickTime) / 1000;
  let visibleStage = stage;

  // 초기화 애니메이션
  if (stage === 0 && t < 0.35) {
    visibleStage = 4;
  }

  push();

  // 접시를 기준으로 푸딩 크기 변경
  translate(250, 350);
  scale(puddingSize);

  // 초기화 시 작아지면서 사라지기
  if (stage === 0 && visibleStage === 4) {
    let shrink = max(0, 1 - t / 0.35);
    scale(shrink);
  }

  translate(-250, -350);

  // 1단계: 푸딩
  if (visibleStage >= 1) {
    animatePart(1, 250, 350, drawPudding);
  }

  // 2단계: 생크림
  if (visibleStage >= 2) {
    animatePart(2, 250, 220, drawCream);
  }

  // 3단계: 딸기
  if (visibleStage >= 3) {
    animatePart(3, 207, 215, drawStrawberry);
  }

  // 4단계: 체리와 스프링클
  if (visibleStage >= 4) {
    animatePart(4, 290, 215, drawCherry);
    drawSprinkles();
  }

  pop();

  // 마지막 단계의 반짝이
  if (stage === 4) {
    drawSparkles();
  }

  // 하단 안내 문구
  let messages = [
    "Click to start!",
    "Pudding!",
    "Whipped cream!",
    "Strawberry!",
    "Complete!"
  ];

  fill("#966473");
  textSize(16);
  text(messages[stage], 250, 425);

  // 진행 단계 표시
  for (let i = 0; i < 5; i++) {

    if (i === stage) {
      fill("#C86E91");
    } else {
      fill("#E6C8D7");
    }

    circle(210 + i * 20, 460, 9);
  }
}


// 재료별 독립 애니메이션
function animatePart(partStage, x, y, drawPart) {
  push();

  // 새로 등장하는 재료만 움직이기
  if (stage === partStage) {

    let t = (millis() - clickTime) / 1000;

    let bounce = sin(t * 19) * exp(-t * 4);

    let fall = max(0, 1 - t / 0.38);
    let jump = -75 * pow(fall, 2);

    let sx = 1 + bounce * 0.20;
    let sy = 1 - bounce * 0.26;

    translate(x, y + jump);
    scale(sx, sy);
    rotate(bounce * 0.13);
    translate(-x, -y);
  }

  drawPart();

  pop();
}


// 기본 푸딩
function drawPudding() {
  noStroke();

  // 몸통
  fill("#FAD373");

  quad(
    165, 220,
    335, 220,
    360, 330,
    140, 330
  );

  // 둥근 바닥
  ellipse(250, 330, 220, 55);

  // 오른쪽 음영
  fill("#EDB65E");

  quad(
    310, 220,
    335, 220,
    360, 330,
    332, 330
  );

  // 카라멜 윗면
  fill("#AE653E");
  ellipse(250, 220, 170, 55);

  // 카라멜 하이라이트
  fill("#C98B55");
  ellipse(245, 212, 125, 27);

  // 몸통 하이라이트
  push();

  translate(176, 280);
  rotate(PI / 18);

  fill("#FFEBA9");
  rect(-6, -24, 12, 48, 6);

  pop();
}


// 생크림
function drawCream() {
  noStroke();

  fill("#EBDDD2");
  ellipse(250, 211, 88, 27);

  fill("#FFFBF0");
  ellipse(250, 204, 85, 30);
  ellipse(250, 187, 68, 32);
  ellipse(250, 172, 48, 30);
  ellipse(250, 157, 28, 27);
  ellipse(250, 145, 12, 22);
}


// 딸기
function drawStrawberry() {
  push();

  translate(207, 191);
  rotate(-PI / 6);

  // 딸기 몸체
  fill("#EF5B74");
  ellipse(0, 0, 34, 43);
  ellipse(0, 9, 25, 30);

  // 딸기 씨앗
  fill("#FFE2A5");

  for (let i = 0; i < 6; i++) {
    ellipse(
      sin(i * 3) * 9,
      -12 + i * 5,
      3, 5
    );
  }

  // 딸기 잎
  fill("#77AB70");
  ellipse(-6, -20, 16, 7);
  ellipse(6, -20, 16, 7);
  ellipse(0, -22, 7, 12);

  pop();
}


// 체리
function drawCherry() {
  noStroke();

  fill("#B92D4E");
  circle(290, 197, 33);

  // 하이라이트
  fill("#FF96A5");
  ellipse(281, 189, 8, 6);

  // 줄기
  noFill();
  stroke("#699155");
  strokeWeight(3);

  bezier(
    290, 182,
    280, 160,
    291, 153,
    305, 150
  );

  noStroke();
}


// 스프링클
function drawSprinkles() {
  let colors = [
    "#F58BAA",
    "#B4A0DF",
    "#FFF4CC",
    "#9CC8B5"
  ];

  let t = (millis() - clickTime) / 1000;

  for (let i = 0; i < 20; i++) {

    let x = 175 + (i * 37) % 150;
    let y = 260 + (i * 23) % 65;

    let offset = 0;
    let bounce = 0;
    let grow = 1;

    if (stage === 4) {

      let delay = i * 0.025;
      let localTime = t - delay;

      if (localTime < 0) {
        continue;
      }

      let fall = max(0, 1 - localTime / 0.35);

      offset = -100 * pow(fall, 2);

      bounce = sin(localTime * 22)
        * exp(-localTime * 6);

      grow = constrain(localTime * 10, 0, 1);
    }

    push();

    translate(x, y + offset);
    rotate(i * 1.3 + bounce);

    scale(
      grow * (1 + bounce * 0.2),
      grow * (1 - bounce * 0.2)
    );

    fill(colors[i % colors.length]);
    rect(-5, -2, 10, 4, 2);

    pop();
  }
}


// 반짝이는 별
function drawSparkles() {
  noStroke();
  fill("#EBB655");

  let t = (millis() - clickTime) / 1000;

  for (let i = 0; i < 8; i++) {

    let angle = TWO_PI / 8 * i;

    let x = 250 + cos(angle) * 175;
    let y = 240 + sin(angle) * 110;

    let appear = constrain(t * 3, 0, 1);

    let s = (
      10 + sin(frameCount * 0.06 + i) * 4
    ) * appear;

    beginShape();

    vertex(x, y - s);
    vertex(x + s * 0.25, y - s * 0.25);
    vertex(x + s, y);
    vertex(x + s * 0.25, y + s * 0.25);
    vertex(x, y + s);
    vertex(x - s * 0.25, y + s * 0.25);
    vertex(x - s, y);
    vertex(x - s * 0.25, y - s * 0.25);

    endShape(CLOSE);
  }
}
