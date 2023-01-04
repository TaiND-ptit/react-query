
import { Posts, Post } from "types/Post.type";
import http from "utils/http";

export const getPosts = (page: number | string, limit: number | string) =>
    http.get<Posts>('posts', {
        params: {
            _page: page,
            _limit: limit,
        }
    })

export const getPost = (id: number | string) => http.get<Post>(`posts/${id}`)

export const addPost = (post: Omit<Post, 'id'>) => http.post<Post>('/posts', post)

export const updatePost = (id: number | string, post: Post) => http.put<Post>(`posts/${id}`, post)

export const deletePost = (id: number | string) => http.delete<{}>(`posts/${id}`)