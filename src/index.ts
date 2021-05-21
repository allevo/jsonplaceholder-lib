'use strict'

import axios, { AxiosInstance } from 'axios'
import { PostList } from './types/post-list'
import PostListJsonSchema from './jsonschemas/post-list.json'
import Ajv, { ValidateFunction } from 'ajv'

export class JSONPlaceholder {
    private instance: AxiosInstance
    private postListValidator: ValidateFunction

    constructor(baseURL: string = 'https://jsonplaceholder.typicode.com') {
        this.instance = axios.create({
            baseURL,
            timeout: 1000,
            headers: {'X-Custom-Header': 'foobar'}
        });
        const ajv = new Ajv()
        this.postListValidator = ajv.compile(PostListJsonSchema)
    }

    async listPost({ userId }: { userId?: number } = {}): Promise<PostList> {
        const response = await this.instance.get('/posts', {
            params: {
                userId
            }
        })
        const {data} = response
        if (!this.postListValidator(data)) {
            throw new Error('Invalid response')
        }
        return response.data
    }
}
