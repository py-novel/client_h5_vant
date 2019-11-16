<template>
    <div>
        <van-search placeholder="请输入搜索关键词" show-action v-model="keyword"
            @clear="input"
            @input="input">
            <div slot="action" @click="queryNovelList">搜索</div>
        </van-search>

        <div v-if="loading" class="loading-wrap">
            <van-loading type="spinner" color="#1989fa">
                加载中...
            </van-loading>
        </div>

        <div v-if="novelList.length > 0">
            <div class="nav-title">找到了这些书</div>
            <div class="novel-list nav-content">
                <Novel v-for="novel in novelList"
                    class="novel-item"
                    @click="goIntroPage(novel.bookUrl)"
                    :key="novel.bookUrl"
                    :bookName="novel.bookName"
                    :authorName="novel.authorName"/>
            </div>
        </div>

        <div v-if="hotList.length > 0">
            <div class="nav-title">热门搜索</div>
            <div class="nav-content hot-list">
                <div v-for="hot in hotList"
                    class="hot-item"
                    @click="search(hot.keyword)"
                    :key="hot.keyword">
                    {{hot.keyword}}
                </div>
            </div>
        </div>

        <div v-if="histList.length > 0">
            <div class="nav-title">搜索历史</div>
            <div class="nav-content">
                <div v-for="hist in histList"
                    class="hist-item"
                    @click="search(hist.keyword)"
                    :key="hist.id">
                    <span>{{hist.keyword}}</span>
                    <van-icon name="arrow" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { SEARCH_HIST_GET, SEARCH_HOT_GET, SEARCH_NOVEL_GET } from "@/configs/api"
import request from "@/utils/request"
import Novel from '@/components/Novel'
import { Search, Grid, GridItem, Icon, Loading } from 'vant'

export default {
    components: {
        [Search.name]: Search,
        [Grid.name]: Grid,
        [GridItem.name]: GridItem,
        [Icon.name]: Icon,
        [Loading.name]: Loading,
        Novel,
    },
    data () {
        return {
            keyword: '',
            hotList: [],
            histList: [],
            novelList: [],
            loading: false,
        }
    },
    mounted () {
        this.queryHotList()
        this.queryHistList()
    },
    methods: {
        async queryHotList () {
            const result = await request({ url: SEARCH_HOT_GET, method: 'GET' })
            if (result.code !== '0000') return
            this.hotList = result.data
        },

        async queryHistList () {
            const userId = localStorage.getItem('userId')
            if (!userId) return
            const result = await request({ url: SEARCH_HIST_GET, method: 'GET', params: { userId } })
            if (result.code !== '0000') return
            this.histList = result.data
        },

        async queryNovelList () {
            const keyword = this.keyword
            if (!keyword) return this.$toast('小说名或作者名不能为空')
            const userId = localStorage.getItem('userId')
            if (!userId) return this.$toast('没有找到小说')
            this.loading = true
            const result = await request({ url: SEARCH_NOVEL_GET, method: 'GET', params: { userId, keyword } })
            this.loading = false
            if (result.code !== '0000') return
            this.novelList = result.data
        },

        goIntroPage (novelUrl) {
            this.$router.push({ name: 'intro', params: { novelUrl } })
        },

        search (keyword) {
            this.keyword = keyword
            this.queryNovelList()
        },

        input (e) {
            if (typeof e === 'string' && e === '') {
                this.novelList = []
            } else {
                this.novelList = []
            }
        },
    }        
}
</script>

<style lang="scss" scoped>
.nav-title {
    margin: 0;
    padding: 20px 16px 16px;
    font-weight: normal;
    line-height: 1.024rem;
    color: #333;
    font-size: 14px;
}

.nav-content {
    background-color: #fff;
    border-radius: 10px;
    width: 96%;
    box-sizing: border-box;
    margin: 0 auto;
    padding: 10px;
}

.hot-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    .hot-item {
        width: 33%;
        height: 60px;
        line-height: 60px;
        color: #333;
        font-size: 16px;
        text-align: center;
    }
}

.novel-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 20px!important;

    .novel-item {
        width: 40%;
        margin: 10px 16px;
    }
}

.hist-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    border-bottom: 1px solid #ebedf0;
    font-size: 16px;
    color: #333;

    &:last-child {
        border-bottom: none;
    }
}

.loading-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
}
</style>