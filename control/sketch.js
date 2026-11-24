
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

// 버튼 설정
let buttonX = 175;
let buttonY = 190;
let buttonRadius = 85;

// 슬라이더 설정
let sliderStartX = 55;
let sliderEndX = 295;
let sliderY = 375;
let handleX = 175;

let dragging = false;
let clickTime = -10000;

function setup() {
  createCanvas(350, 500);
  textAlign(CENTER, CENTER);
  noStroke();

  // 슬라이더의 기존 값 불러오기
  db.ref("flower/slider").on("value", function(snapshot) {
    let value = snapshot.val();

    if (typeof value === "number" && !dragging) {
      handleX = map(
        constrain(value, 0, 100),
        0, 100,
        sliderStartX, sliderEndX
      );
    }
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
  text("PUDDING MAKER", 175, 55);

  // 버튼 애니메이션
  let t = (millis() - clickTime) / 1000;
  let bounce = sin(t * 20) * exp(-t * 6);

  push();

  translate(buttonX, buttonY);
  scale(1 + bounce * 0.08, 1 - bounce * 0.12);

  // 버튼 아래쪽 그림자
  fill("#D98EA8");
  circle(0, 8, buttonRadius * 2);

  // 버튼
  fill("#F5B8CE");
  circle(0, 0, buttonRadius * 2);

  // 버튼 하이라이트
  fill("#FAD1DF");
  ellipse(0, -58, 90, 18);

  // 버튼 글씨
  fill("#96546F");
  textSize(26);
  textStyle(BOLD);
  text("CLICK!", 0, 0);
  textStyle(NORMAL);

  pop();

  // 안내 문구
  fill("#966473");
  textSize(16);
  text("Make your pudding!", 175, 310);

  // 슬라이더 배경
  stroke("#E8C8D5");
  strokeWeight(8);
  line(sliderStartX, sliderY, sliderEndX, sliderY);

  // 슬라이더 채워진 부분
  stroke("#E6A0BB");
  line(sliderStartX, sliderY, handleX, sliderY);

  noStroke();

  // 슬라이더 손잡이
  fill("#C86E91");
  circle(handleX, sliderY, 24);

  fill("#FAD1DF");
  circle(handleX - 3, sliderY - 3, 8);

  // 슬라이더 숫자
  let value = round(
    map(handleX, sliderStartX, sliderEndX, 0, 100)
  );

  fill("#966473");
  textSize(15);
  text("PUDDING SIZE", 175, 415);

  textSize(20);
  text(value + "%", 175, 445);
}

// Firebase에 클릭 신호 보내기
function sendGrow() {
  db.ref("flower/clicks").set(
    firebase.database.ServerValue.increment(1)
  ).catch(function(error) {
    console.error(error);
  });
}

// Firebase에 슬라이더 값 보내기
function sendSlider() {
  let value = round(
    map(handleX, sliderStartX, sliderEndX, 0, 100)
  );

  db.ref("flower/slider").set(value)
    .catch(function(error) {
      console.error(error);
    });
}

// 버튼 및 슬라이더 클릭
function mousePressed() {
  if (
    dist(mouseX, mouseY, buttonX, buttonY)
    < buttonRadius
  ) {
    clickTime = millis();
    sendGrow();
  }

  if (
    abs(mouseY - sliderY) < 20 &&
    mouseX >= sliderStartX - 15 &&
    mouseX <= sliderEndX + 15
  ) {
    dragging = true;

    handleX = constrain(
      mouseX,
      sliderStartX,
      sliderEndX
    );

    sendSlider();
  }
}

// 슬라이더 드래그
function mouseDragged() {
  if (dragging) {
    handleX = constrain(
      mouseX,
      sliderStartX,
      sliderEndX
    );

    sendSlider();
  }
}

function mouseReleased() {
  dragging = false;
}
