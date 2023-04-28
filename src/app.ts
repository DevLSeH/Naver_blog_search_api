import dotenv from 'dotenv'
import axios from 'axios'
import { Url } from 'url';
dotenv.config();

interface blogObject {
  link: Url,
  name: string,
  title: string,
  description: string,
}

const apiClient = axios.create({
  baseURL: "https://openapi.naver.com/v1",
  headers: {
    "X-Naver-Client-Id": process.env.Id,
    "X-Naver-Client-Secret": process.env.Secret
  },
});

const blogUrls = async (keyword: string, maxResults: number) => {
  try {
    const response = await apiClient.get("/search/blog.json", {
      params: {
        query: keyword,
        display: maxResults,
        sort: 'sim',
      },
    })
    const data = response.data;
    let result = [];
    for (let i = 0; i < maxResults; i++) {
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

blogUrls('닥터지', 2)