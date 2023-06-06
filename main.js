const clothes = {
  cardigan: "./img/cardigan.png",
  blazer: "./img/blazer.png",
  coat: "./img/coat.png",
  cottonP: "./img/cottonP.png",
  denim: "./img/denim.png",
  denimjacket: "./img/denimjacket.png",
  fishtail: "./img/fishtail.png",
  hoodie: "./img/hoodie.png",
  jacket: "./img/jacket.png",
  knit: "./img/knit.png",
  leather: "./img/leather.png",
  linen: "./img/linen.png",
  longT: "./img/longT.png",
  ma1: "./img/ma1.png",
  MTM: "./img/MTM.png",
  padding: "./img/padding.png",
  shirt: "./img/shirt.png",
  shorts: "./img/shorts.png",
  shortT: "./img/shortT.png",
  sleeveless: "./img/sleeveless.png",
  trench: "./img/trench.png",
};

let lowOuterIndex = 0;
let lowTopIndex = 0;
let lowBottomIndex = 0;
let highOuterIndex = 0;
let highTopIndex = 0;
let highBottomIndex = 0;

showToday();

// 오늘의 날짜를 출력하는 함수
function showToday() {
  const date = new Date();
  const dateContent = document.querySelector("#date");
  dateContent.textContent = `${date.getFullYear()}년 ${
    date.getMonth() + 1
  }월 ${date.getDate()}일`;
}

// 오늘 / 내일 / 모래의 radio 버튼에 맞게 각각의 날짜를 출력하는 함수
function showDate(date) {
  const today = new Date();
  const dateContent = document.querySelector("#date");
  if (date === "today") showToday();
  else if (date === "tomorrow") {
    const tomorrow = new Date(today.setDate(today.getDate() + 1));
    dateContent.textContent = `${tomorrow.getFullYear()}년 ${
      tomorrow.getMonth() + 1
    }월 ${tomorrow.getDate()}일`;
  } else {
    const afterTomorrow = new Date(today.setDate(today.getDate() + 2));
    dateContent.textContent = `${afterTomorrow.getFullYear()}년 ${
      afterTomorrow.getMonth() + 1
    }월 ${afterTomorrow.getDate()}일`;
  }
}

// 날짜, 시간 입력을 기반으로 날씨, 미세먼지 정보 조회 및
// 정보에 맞는 결과 출력
async function getData() {
  const input = new Object();
  // 지역
  const location = document.querySelector("#location-select").value;

  // 날짜
  const date = document.querySelector("#date").textContent;
  const dateRegex = /(\d{4})년 (\d{1,2})월 (\d{1,2})일/;
  const match = date.match(dateRegex);
  // 시작 시간
  const startTime = document.querySelector("#start-time").value;

  // 끝 시간
  const endTime = document.querySelector("#end-time").value;

  const now = new Date();
  // 끝나는 시간, 시작 시간 에러 처리
  if (
    parseInt(now.getHours()) > parseInt(startTime) &&
    parseInt(match[3]) === parseInt(now.getDate())
  ) {
    document.querySelector("#time-error").textContent =
      "현재 시각 이후만 조회할 수 있어요!";
  } else if (startTime === "") {
    document.querySelector("#time-error").textContent =
      "시작 시간을 설정해주세요!";
  } else if (endTime === "") {
    document.querySelector("#time-error").textContent =
      "끝나는 시간을 설정해주세요!";
  } else if (parseInt(startTime) >= parseInt(endTime)) {
    document.querySelector("#time-error").textContent =
      "끝나는 시간이 시작 시간보다 이후여야 해요!";
    return;
  } else {
    document.querySelector("#loading").textContent = "로딩중";
    document.querySelector("#time-error").textContent = "";
    input.location = location;
    input.date = `${match[1].slice(0, 4)}${match[2].padStart(
      2,
      "0"
    )}${match[3].padStart(2, "0")}`;
    input.startTime = startTime.slice(0, 2).padEnd(4, "0");
    input.endTime = endTime.slice(0, 2).padEnd(4, "0");

    const weatherRes = getWeatherData(input);
    const dustRes = getDustData();

    const [weather, dust] = await Promise.all([weatherRes, dustRes]);

    document.querySelector("#loading").textContent = "";

    printData(weather, dust);
  }
}

// 날씨, 미세먼지 정보 출력 함수
function printData(weather, dust) {
  const highEl = document.querySelector("#high-temp");
  const lowEl = document.querySelector("#low-temp");
  const rainEl = document.querySelector("#rain-info");
  const dustEl = document.querySelector("#dust-info");

  lowEl.textContent = `최저기온: ${weather[0]}`;
  highEl.textContent = `최고기온: ${weather[1]}`;
  rainEl.textContent = `강수확률: ${weather[2]}`;
  dustEl.textContent = `미세먼지 단계: ${dust}`;

  printClothes(weather[1], "high");
  printClothes(weather[0], "low");
  printRain(weather[2]);
  printDust(dust);
}

function printClothes(temp, scope) {
  const outerEl = document.querySelector(`#${scope} .outer .clothes`);
  outerEl.innerHTML = "";
  const topEl = document.querySelector(`#${scope} .top .clothes`);
  topEl.innerHTML = "";
  const bottomEl = document.querySelector(`#${scope} .bottom .clothes`);
  bottomEl.innerHTML = "";
  if (temp >= 27) {
    const tops = ["sleeveless", "shortT"];
    tops.forEach((top) => {
      topEl.innerHTML += `<img class="clothes-img" src=${clothes[top]} />`;
    });
    const bottoms = ["shorts"];
    bottoms.forEach((bottom) => {
      bottomEl.innerHTML += `<img class="clothes-img" src=${clothes[bottom]} />`;
    });
  } else if (23 <= temp && temp < 27) {
    const tops = ["shortT", "linen", "longT"];
    tops.forEach((top) => {
      topEl.innerHTML += `<img class="clothes-img" src=${clothes[top]} />`;
    });
    const bottoms = ["shorts", "cottonP", "denim"];
    bottoms.forEach((bottom) => {
      bottomEl.innerHTML += `<img class="clothes-img" src=${clothes[bottom]} />`;
    });
  } else if (20 <= temp && temp < 23) {
    const tops = ["longT", "shortT", "shirt", "MTM"];
    tops.forEach((top) => {
      topEl.innerHTML += `<img class="clothes-img" src=${clothes[top]} />`;
    });
    const bottoms = ["cottonP", "denim"];
    bottoms.forEach((bottom) => {
      bottomEl.innerHTML += `<img class="clothes-img" src=${clothes[bottom]} />`;
    });
  } else if (17 <= temp && temp < 20) {
    const outers = ["cardigan"];
    outers.forEach((outer) => {
      outerEl.innerHTML += `<img class="clothes-img" src=${clothes[outer]} />`;
    });
    const tops = ["knit", "MTM", "hoodie", "longT"];
    tops.forEach((top) => {
      topEl.innerHTML += `<img class="clothes-img" src=${clothes[top]} />`;
    });
    const bottoms = ["denim", "cottonP"];
    bottoms.forEach((bottom) => {
      bottomEl.innerHTML += `<img class="clothes-img" src=${clothes[bottom]} />`;
    });
  } else if (12 <= temp && temp < 17) {
    const outers = ["blazer", "denimjacket", "jacket"];
    outers.forEach((outer) => {
      outerEl.innerHTML += `<img class="clothes-img" src=${clothes[outer]} />`;
    });
    const tops = ["longT", "MTM", "knit", "hoodie"];
    tops.forEach((top) => {
      topEl.innerHTML += `<img class="clothes-img" src=${clothes[top]} />`;
    });
    const bottoms = ["denim", "cottonP"];
    bottoms.forEach((bottom) => {
      bottomEl.innerHTML += `<img class="clothes-img" src=${clothes[bottom]} />`;
    });
  } else if (9 <= temp && temp < 12) {
    const outers = ["coat", "fishtail", "ma1"];
    outers.forEach((outer) => {
      outerEl.innerHTML += `<img class="clothes-img" src=${clothes[outer]} />`;
    });
    const tops = ["knit", "MTM", "hoodie"];
    tops.forEach((top) => {
      topEl.innerHTML += `<img class="clothes-img" src=${clothes[top]} />`;
    });
    const bottoms = ["denim", "cottonP"];
    bottoms.forEach((bottom) => {
      bottomEl.innerHTML += `<img class="clothes-img" src=${clothes[bottom]} />`;
    });
  } else if (5 <= temp && temp < 9) {
    const outers = ["coat", "leather"];
    outers.forEach((outer) => {
      outerEl.innerHTML += `<img class="clothes-img" src=${clothes[outer]} />`;
    });
    const tops = ["knit", "MTM", "hoodie"];
    tops.forEach((top) => {
      topEl.innerHTML += `<img class="clothes-img" src=${clothes[top]} />`;
    });
    const bottoms = ["denim", "cottonP"];
    bottoms.forEach((bottom) => {
      bottomEl.innerHTML += `<img class="clothes-img" src=${clothes[bottom]} />`;
    });
  } else {
    const outers = ["padding", "coat"];
    outers.forEach((outer) => {
      outerEl.innerHTML += `<img class="clothes-img" src=${clothes[outer]} />`;
    });
    const tops = ["knit", "MTM", "hoodie", "cardigan"];
    tops.forEach((top) => {
      topEl.innerHTML += `<img class="clothes-img" src=${clothes[top]} />`;
    });
    const bottoms = ["denim", "cottonP"];
    bottoms.forEach((bottom) => {
      bottomEl.innerHTML += `<img class="clothes-img" src=${clothes[bottom]} />`;
    });
  }
}

function printRain(rain) {
  const rainEl = document.querySelector("#rain-message");
  if (rain > 60) {
    rainEl.textContent = "비가 올 확률이 높아요";
  } else if (rain > 30) {
    rainEl.textContent = "살짝 흐리지만 비는 안 올것 같아요";
  } else {
    rainEl.textContent = "아주 쨍쨍한 날씨에요!";
  }
}

function printDust(dust) {
  const dustEl = document.querySelector("#dust-message");
  if (dust === "좋음") {
    dustEl.textContent = "마스크를 착용하지 않아도 되겠어요";
  } else if (dust === "보통") {
    dustEl.textContent =
      "마스크를 착용하지 않거나 가볍게 덴탈 마스크를 쓰고 나가도 될것 같아요";
  } else {
    dustEl.textContent = "미세먼지가 많아요. KF 마스크를 착용해야겠어요";
  }
}

function prevItem(event) {
  // console.log(event.target.nextElementSibling.children[0].childNodes.length);
  if (event.target.parentElement.classList.contains("outer")) {
    if (event.target.parentElement.parentElement.id === "high") {
      if (highOuterIndex > 0) {
        highOuterIndex--;
        event.target.nextElementSibling.children[0].style.transform = `translateX(${
          highOuterIndex * -300
        }px)`;
      }
    }
    if (event.target.parentElement.parentElement.id === "low") {
      if (lowOuterIndex > 0) {
        lowOuterIndex--;
        event.target.nextElementSibling.children[0].style.transform = `translateX(${
          lowOuterIndex * -300
        }px)`;
      }
    }
  }
  if (event.target.parentElement.classList.contains("top")) {
    if (event.target.parentElement.parentElement.id === "high") {
      if (highTopIndex > 0) {
        highTopIndex--;
        event.target.nextElementSibling.children[0].style.transform = `translateX(${
          highTopIndex * -300
        }px)`;
      }
      console.log(event.target.nextElementSibling.children[0].style.transform);
    }
    if (event.target.parentElement.parentElement.id === "low") {
      if (lowTopIndex > 0) {
        lowTopIndex--;
        event.target.nextElementSibling.children[0].style.transform = `translateX(${
          lowTopIndex * -300
        }px)`;
      }
    }
  }
  if (event.target.parentElement.classList.contains("bottom")) {
    if (event.target.parentElement.parentElement.id === "high") {
      if (highBottomIndex > 0) {
        highBottomIndex--;
        event.target.nextElementSibling.children[0].style.transform = `translateX(${
          highBottomIndex * -300
        }px)`;
      }
    }
    if (event.target.parentElement.parentElement.id === "low") {
      if (lowBottomIndex > 0) {
        lowBottomIndex--;
        event.target.nextElementSibling.children[0].style.transform = `translateX(${
          lowBottomIndex * -300
        }px)`;
      }
    }
  }
}

function nextItem(event) {
  // console.log(event.target.nextElementSibling.children[0].childNodes.length);
  if (event.target.parentElement.classList.contains("outer")) {
    if (event.target.parentElement.parentElement.id === "high") {
      if (
        highOuterIndex <
        event.target.previousElementSibling.children[0].childNodes.length - 1
      ) {
        highOuterIndex++;
        event.target.previousElementSibling.children[0].style.transform = `translateX(${
          highOuterIndex * -300
        }px)`;
      }
    }
    if (event.target.parentElement.parentElement.id === "low") {
      if (
        lowOuterIndex <
        event.target.previousElementSibling.children[0].childNodes.length - 1
      ) {
        lowOuterIndex++;
        event.target.previousElementSibling.children[0].style.transform = `translateX(${
          lowOuterIndex * -300
        }px)`;
      }
    }
  }
  if (event.target.parentElement.classList.contains("top")) {
    if (event.target.parentElement.parentElement.id === "high") {
      if (
        highTopIndex <
        event.target.previousElementSibling.children[0].childNodes.length - 1
      ) {
        highTopIndex++;
        event.target.previousElementSibling.children[0].style.transform = `translateX(${
          highTopIndex * -300
        }px)`;
      }
      console.log(
        event.target.previousElementSibling.children[0].style.transform
      );
    }
    if (event.target.parentElement.parentElement.id === "low") {
      if (
        lowTopIndex <
        event.target.previousElementSibling.children[0].childNodes.length - 1
      ) {
        lowTopIndex++;
        event.target.previousElementSibling.children[0].style.transform = `translateX(${
          lowTopIndex * -300
        }px)`;
      }
    }
  }
  if (event.target.parentElement.classList.contains("bottom")) {
    if (event.target.parentElement.parentElement.id === "high") {
      if (
        highBottomIndex <
        event.target.previousElementSibling.children[0].childNodes.length - 1
      ) {
        highBottomIndex++;
        event.target.previousElementSibling.children[0].style.transform = `translateX(${
          highBottomIndex * -300
        }px)`;
      }
    }
    if (event.target.parentElement.parentElement.id === "low") {
      if (
        lowBottomIndex <
        event.target.previousElementSibling.children[0].childNodes.length - 1
      ) {
        lowBottomIndex++;
        event.target.previousElementSibling.children[0].style.transform = `translateX(${
          lowBottomIndex * -300
        }px)`;
      }
    }
  }
}

// 날씨 정보를 가져오는 함수
async function getWeatherData(input) {
  // 서비스 키
  const serviceKey =
    "N7wqZh%2BlxJdvTV9uGGFyCoDaNbAyZaewIcPVdBVZczBKGifygfW7fNkVTag7Xeg83K%2Ft9AP7Wg4DyBKezlt%2BRw%3D%3D";

  // base_date, base_time
  const date = getBase();

  const weatherRes = await fetch(
    `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${serviceKey}&numOfRows=1000&pageNo=1&dataType=JSON&base_date=${date[0]}&base_time=${date[1]}&nx=98&ny=77`
  );

  const json = await weatherRes.json();
  const dataArr = json.response.body.items.item;
  // 활동시간에 포함되는 데이터 중 강수확률과 기온만 받아온다.
  const dataEq = dataArr.filter((data) => {
    return (
      data.fcstDate == input.date &&
      parseInt(data.fcstTime) >= parseInt(input.startTime) &&
      parseInt(data.fcstTime) <= parseInt(input.endTime) &&
      (data.category === "POP" || data.category === "TMP")
    );
  });

  // 해당시간의 최저기온, 최고기온, 최대강수확률
  let minTemp = 100;
  let maxTemp = -100;
  let rainProb = 0;
  dataEq.forEach((data) => {
    if (data.category === "POP") {
      if (data.fcstValue > rainProb) rainProb = data.fcstValue;
    } else {
      if (data.fcstValue > maxTemp) maxTemp = data.fcstValue;
      if (data.fcstValue < minTemp) minTemp = data.fcstValue;
    }
  });

  return [minTemp, maxTemp, rainProb];
}

//미세먼지 정보를 가져오는 함수
async function getDustData() {
  const serviceKey =
    "N7wqZh%2BlxJdvTV9uGGFyCoDaNbAyZaewIcPVdBVZczBKGifygfW7fNkVTag7Xeg83K%2Ft9AP7Wg4DyBKezlt%2BRw%3D%3D";
  const dustRes = await fetch(
    `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?serviceKey=${serviceKey}&returnType=json&numOfRows=1&pageNo=1&stationName=연산동&dataTerm=DAILY&ver=1.0`
  );
  const json = await dustRes.json();
  const { pm25Value } = json.response.body.items[0];

  if (pm25Value >= 75) return "매우 나쁨";
  else if (pm25Value >= 35) return "나쁨";
  else if (pm25Value >= 15) return "보통";
  else return "좋음";
}

// base_date, base_time을 계산하는 함수
// 정보를 받을 수 있는 날짜와 시간 제약이 있으므로 현재 시간을 가공해서 반환한다.
// 예보 기준 시간은 02, 05, 08 , 11 ... 단위로 나온다.
// 하지만 API 제공에는 약 10분 정도 걸리므로 02:05분에 02:00 정보를 조회할 수 없다.
// 따라서 6시간 전 정보를 조회한다.
function getBase() {
  let date = new Date();
  let hour = date.getHours();

  if (hour <= 5) {
    hour -= (hour % 3) - 20;
    date = new Date(date.setDate(date.getDate() - 1));
  } else {
    hour -= (hour % 3) + 4;
  }

  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");

  return [
    `${date.getFullYear()}${month}${day}`,
    hour.toString().padStart(2, "0") + "00",
  ];
}
