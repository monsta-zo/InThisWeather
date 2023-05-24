getData();

// 입력을 기반으로 날씨, 미세먼지 정보 제공
function getData() {
  // 서비스 키
  const serviceKey =
    "N7wqZh%2BlxJdvTV9uGGFyCoDaNbAyZaewIcPVdBVZczBKGifygfW7fNkVTag7Xeg83K%2Ft9AP7Wg4DyBKezlt%2BRw%3D%3D";

  // base_date, base_time
  const date = getBase();

  // 현재 시각을 기준으로 날짜 정보를 받아옴
  fetch(
    `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${serviceKey}&numOfRows=1000&pageNo=1&dataType=JSON&base_date=${date[0]}&base_time=${date[1]}&nx=98&ny=77`
  )
    .then((weatherRes) => weatherRes.json())
    .then((weatherRes) => console.log(weatherRes));

  // 위치를 기준으로 오늘의 미세먼지 정보 받아옴
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
