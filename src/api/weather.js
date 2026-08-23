import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast'

export async function fetchWeatherByCity(cityName) {
  const response = await axios.get(BASE_URL, {
    params: {
      q: cityName,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })
  return response.data
}

//지역 맵핑표
export const cityNameMap = {
  // 특별시/광역시
  서울: 'Seoul',
  부산: 'Busan',
  인천: 'Incheon',
  대구: 'Daegu',
  대전: 'Daejeon',
  광주: 'Gwangju',
  울산: 'Ulsan',
  세종: 'Sejong',

  // 경기도
  수원: 'Suwon,KR',
  용인: 'Yongin,KR',
  성남: 'Seongnam,KR',
  고양: 'Goyang,KR',
  화성: 'Hwaseong,KR',
  안산: 'Ansan,KR',
  안양: 'Anyang,KR',
  부천: 'Bucheon,KR',
  평택: 'Pyeongtaek,KR',
  시흥: 'Siheung,KR',
  파주: 'Paju,KR',
  김포: 'Gimpo,KR',
  광명: 'Gwangmyeong,KR',
  광주시: 'Gwangju,KR', // 경기 광주 (광역시 광주와 구분용)

  // 강원도
  춘천: 'Chuncheon,KR',
  원주: 'Wonju,KR',
  강릉: 'Gangneung,KR',
  속초: 'Sokcho,KR',

  // 충청도
  청주: 'Cheongju,KR',
  천안: 'Cheonan,KR',
  아산: 'Asan,KR',
  충주: 'Chungju,KR',

  // 전라도
  전주: 'Jeonju,KR',
  익산: 'Iksan,KR',
  군산: 'Gunsan,KR',
  목포: 'Mokpo,KR',
  여수: 'Yeosu,KR',
  순천: 'Suncheon,KR',

  // 경상도
  포항: 'Pohang,KR',
  구미: 'Gumi,KR',
  경주: 'Gyeongju,KR',
  창원: 'Changwon,KR',
  진주: 'Jinju,KR',
  김해: 'Gimhae,KR',
  양산: 'Yangsan,KR',

  // 제주
  제주: 'Jeju,KR',
  서귀포: 'Seogwipo,KR',
}
export function getTomorrowForecast(data) {
  if (!data || !data.list || data.list.length === 0) {
    return null
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowDateStr = tomorrow.toISOString().split('T')[0]

  const found = data.list.find((item) => item.dt_txt && item.dt_txt.startsWith(tomorrowDateStr))

  return found || data.list[0]
}
//내일 날짜의 예보 데이터 찾아주는 함수-내일 하루 전체 시간대 목록(3시간 간격)
export function getTomorrowFullDay(data) {
  if (!data || !data.list || data.list.length === 0) {
    return []
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowDateStr = tomorrow.toISOString().split('T')[0]

  const filtered = data.list.filter(
    (item) => item.dt_txt && item.dt_txt.startsWith(tomorrowDateStr),
  )

  return filtered.length > 0 ? filtered : data.list.slice(0, 8)
}
