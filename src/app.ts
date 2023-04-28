import dotenv from 'dotenv'
import axios from 'axios'
import { Url } from 'url';
dotenv.config(); /** .env 파일 참조를 위한 함수 */

/* 블로그 정보를 담을 오브젝트 타입 정의 */
interface blogObject {
  link: Url,
  name: string,
  title: string,
  description: string,
}

/* 기본 url 지정 및 헤더에 포함해야하는 id와 secret key 입력 */
/* id와 secret key는 노출되지 않도록 .env 파일에서 참조 */
const apiClient = axios.create({
  baseURL: "https://openapi.naver.com/v1",
  headers: {
    "X-Naver-Client-Id": process.env.Id,
    "X-Naver-Client-Secret": process.env.Secret
  },
});

// api 요청 시 검색할 문자열과 표시할 검색 결과 수를 조절할 수 있도록 함수 인자 설정, 타입 지정
const blogUrls = async (keyword: string, maxResults: number) => {
  try {
    const response = await apiClient.get("/search/blog.json", {
      params: {
        query: keyword,
        display: maxResults,
        sort: 'sim', /** 정렬 방식, sim(정확도) 또는 date(날짜) */
      },
    })
    const data = response.data;
    let result = []; /** 반환할 배열 선언 */
    for (let i = 0; i < maxResults; i++) { /** api 호출 결과로 받은 데이터를 차례로 순회하며 필요한 정보 추출 */
      const blog = data.items[i];
      const blogname = blog.bloggername;
      const postLink = blog.link;
      const postTitle = blog.title;
      const postDescription = blog.description;

      const blogResult: blogObject = {
        name: blogname,
        link: postLink,
        title: postTitle,
        description: postDescription,
      }
      result[i] = blogResult;
    }
    console.log(result);
    return result;

  } catch (error) {
    console.error(error);

  }
}

blogUrls('닥터지', 2);  /** 선언한 api 함수 호출 */