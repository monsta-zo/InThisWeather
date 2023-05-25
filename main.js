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

// 날짜, 시간 입력을 기반으로 날씨, 미세먼지 정보 조회
function getData() {
  const input = new Object();
  // 지역
  const location = document.querySelector("#location-select").value;
  input.location = location;

  // 날짜
  const date = document.querySelector("#date").textContent;
  const dateRegex = /(\d{4})년 (\d{1,2})월 (\d{1,2})일/;
  const match = date.match(dateRegex);
  input.date = `${match[1].slice(2)}${match[2].padStart(
    2,
    "0"
  )}${match[3].padStart(2, "0")}`;

  // 시작 시간
  const startTime = document.querySelector("#start-time").value;
  input.startTime = startTime;

  // 끝 시간
  const endTime = document.querySelector("#end-time").value;
  input.endTime = endTime;

  getWeatherData(input);
  getDustData(input);
}

// 날씨 정보를 가져오는 함수
function getWeatherData(input) {
  // 서비스 키
  const serviceKey =
    "N7wqZh%2BlxJdvTV9uGGFyCoDaNbAyZaewIcPVdBVZczBKGifygfW7fNkVTag7Xeg83K%2Ft9AP7Wg4DyBKezlt%2BRw%3D%3D";

  // base_date, base_time
  const date = getBase();

  fetch(
    `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${serviceKey}&numOfRows=1000&pageNo=1&dataType=JSON&base_date=${date[0]}&base_time=${date[1]}&nx=98&ny=77`
  )
    .then((weatherRes) => weatherRes.json())
    .then((weatherRes) => console.log(weatherRes));
}

// 미세먼지 정보를 가져오는 함수
function getDustData(input) {
  fetch(
    `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?serviceKey=N7wqZh%2BlxJdvTV9uGGFyCoDaNbAyZaewIcPVdBVZczBKGifygfW7fNkVTag7Xeg83K%2Ft9AP7Wg4DyBKezlt%2BRw%3D%3D&returnType=json&numOfRows=50&pageNo=1&stationName=연산동&dataTerm=DAILY&ver=1.0`
  )
    .then((airRes) => airRes.json())
    .then((airRes) => console.log(airRes));
}

// base_date, base_time을 계산하는 함수
// 정보를 받을 수 있는 날짜와 시간 제약이 있으므로 현재 시간을 가공해서 반환한다.
// 예보 기준 시간은 02, 05, 08 , 11 ... 단위로 나온다.
// 하지만 API 제공에는 약 10분 정도 걸리므로 02:05분에 02:00 정보를 조회할 수 없다.
// 따라서 6시간 전 정보를 조회한다.
function getBase() {
  let date = new Date();
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");
  let hour = date.getHours();

  if (hour <= 5) {
    hour -= (hour % 3) - 20;
    date = new Date(date.setDate(date.getDate() - 1));
  } else {
    hour -= (hour % 3) + 4;
  }

  return [`${date.getFullYear()}${month}${day}`, hour + "00"];
}
