<template>
    <div>
        <h2 class="nav-title">书架</h2>

        <div class="novel-empty" v-if="novelList.length === 0">
            <img class="novel-empty-pic" src="../../assets/images/empty.png" alt="empty">
            <van-button @click="goClassifyPage" type="primary">去书屋添加一本书吧~~</van-button>
        </div>

        <div class="novel-list" v-else>
            <Novel v-for="novel in novelList"
                class="novel-item"
                @click="goReadPage(novel.id, novel.recent_chapter_url, novel.book_name)"
                :key="novel.id"
                :bookName="novel.book_name"
                :authorName="novel.author_name"/>  
        </div>

        <Navbar />
    </div>
</template>

<script>
import request from '@/utils/request'
import { SHELF_GET, OAUTH_SIGNIN_H5, OAUTH_TOKEN_GET } from '@/configs/api'
import Novel from '@/components/Novel'
import Navbar from '@/components/Navbar'
import { Button } from 'vant'

export default {
    components: {
        Novel,
        Navbar,
        [Button.name]: Button,
    },
    data () {
        return {
            userId: 12,
            novelList: [],
        }
    },
    async mounted () {
        const userId = localStorage.getItem('userId')

        if (userId) {
            this.userId = userId
            const token = localStorage.getItem('token')
            if (!token) {
                const result = await request({ url: OAUTH_TOKEN_GET, method: 'GET', params: { userId } })
                if (result.code === '0000') localStorage.setItem('token', result.data.token)
            }
        } else {
            // 生成随机数作为 username
            const username = Math.random().toString(17).substr(2)
            // 请求 userId 和 token
            const result = await request({ url: OAUTH_SIGNIN_H5, method: 'POST', data: { username } })
            if (result.code === '0000') {
                this.userId = result.data.userId
                localStorage.setItem('userId', result.data.userId)
                localStorage.setItem('token', result.data.token)
            }
        }

        this.queryShelfList()
    },
    methods: {
        async queryShelfList () {
            const userId = this.userId
            const result = await request({ url: SHELF_GET, method: 'GET', params: { userId } })
            if (result.code !== '0000') return
            this.novelList = result.data
        },

        goReadPage (shelfId, url, bookName) {
            this.$router.push({ name: 'read', params: { shelfId, url, bookName } })
        },

        goClassifyPage () {
            this.$router.push('classify')
        },
    }
}
</script>

<style lang="scss" scoped>
.nav-title {
    font-size: 18px;
    font-weight: 500;
    margin-top: 16px;
    padding-left: 50px;
}
.novel-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    padding: 0 20px 50px;
    height: calc(100vh - 50px);
    overflow: auto;
}
.novel-item {
    width: 40%;
    height: 45vw;
    margin-bottom: 20px;
    margin-left: 20px;
}

.novel-empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 70vh;
}
.novel-empty-pic {
    width: 50%;
    margin-bottom: 20px;
}
</style>