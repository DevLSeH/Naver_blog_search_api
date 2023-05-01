"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config(); /** .env 파일 참조를 위한 함수 */
/* 기본 url 지정 및 헤더에 포함해야하는 id와 secret key 입력 */
/* id와 secret key는 노출되지 않도록 .env 파일에서 참조 */
const apiClient = axios_1.default.create({
    baseURL: "https://openapi.naver.com/v1",
    headers: {
        "X-Naver-Client-Id": process.env.Id,
        "X-Naver-Client-Secret": process.env.Secret
    },
});
// api 요청 시 검색할 문자열과 표시할 검색 결과 수를 조절할 수 있도록 함수 인자 설정, 타입 지정
const blogUrls = (keyword, maxResults) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get 기능으로 url 요청, json으로 결과값 반환(xml 형식도 가능)
        const response = yield apiClient.get("/search/blog.json", {
            params: {
                query: keyword,
                display: maxResults,
                sort: "sim", /** 정렬 방식, sim(정확도) 또는 date(날짜) */
            },
        });
        const data = response.data;
        let result = []; /** 결과를 저장할 배열 선언 */
        for (let i = 0; i < maxResults; i++) { /** api 호출 결과로 받은 데이터를 차례로 순회하며 필요한 정보 추출 */
            const blog = data.items[i];
            const blogname = blog.bloggername;
            const postLink = blog.link;
            const postTitle = blog.title;
            const postDescription = blog.description;
            const blogResult = {
                name: blogname,
                link: postLink,
                title: postTitle,
                description: postDescription,
            };
            //for 문 안에서 각 index에 객체 저장
            result[i] = blogResult;
        }
        //전체 result 반환
        console.log(result);
        return result;
    }
    catch (error) {
        console.error(error);
    }
});
blogUrls("닥터지", 2); /** 선언한 api 함수 호출 */
