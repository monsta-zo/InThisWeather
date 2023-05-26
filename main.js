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

  // 날짜
  const date = document.querySelector("#date").textContent;
  const dateRegex = /(\d{4})년 (\d{1,2})월 (\d{1,2})일/;
  const match = date.match(dateRegex);

  // 시작 시간
  const startTime = document.querySelector("#start-time").value;

  // 끝 시간
  const endTime = document.querySelector("#end-time").value;

  // 끝나는 시간, 시작 시간 에러 처리
  if (startTime === "") {
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
    document.querySelector("#time-error").textContent = "";
    input.location = location;
    input.date = `${match[1].slice(0, 4)}${match[2].padStart(
      2,
      "0"
    )}${match[3].padStart(2, "0")}`;
    input.startTime = startTime.slice(0, 2).padEnd(4, "0");
    input.endTime = endTime.slice(0, 2).padEnd(4, "0");
    getWeatherData(input);
    getDustData(input);
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
  console.log("데이터 받음!");
  const dataArr = json.response.body.items.item;
  console.log(input.date);
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
function getDustData(input) {
  fetch(
    `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?serviceKey=N7wqZh%2BlxJdvTV9uGGFyCoDaNbAyZaewIcPVdBVZczBKGifygfW7fNkVTag7Xeg83K%2Ft9AP7Wg4DyBKezlt%2BRw%3D%3D&returnType=json&numOfRows=1&pageNo=1&stationName=연산동&dataTerm=DAILY&ver=1.0`
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
  let hour = date.getHours();

  if (hour <= 5) {
    hour -= (hour % 3) - 20;
    date = new Date(date.setDate(date.getDate() - 1));
  } else {
    hour -= (hour % 3) + 4;
  }

  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");

  return [`${date.getFullYear()}${month}${day}`, hour + "00"];
}
