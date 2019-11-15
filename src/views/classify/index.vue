<template>
    <div>
        <div class="header">
            <div class="header-search" @click="goSearchPage">
                <van-icon name="search" />
                <span class="search-placeholder">搜索</span>
            </div>
        </div>

        <div class="classify">
            <div class="classify-left">
                <div v-for="classify in classifyList" 
                    :key="classify.id"
                    @click="clickClassify(classify.id)"
                    :class="activeClassifyId === classify.id ? 'classify-item-active classify-item' : 'classify-item'">
                    {{classify.desc}}
                </div>
            </div>
            <div class="classify-right">
                <Novel v-for="novel in novelList"
                    class="novel-item"
                    @click="goIntroPage(novel.book_url)"
                    :key="novel.id"
                    :bookName="novel.book_name"
                    :authorName="novel.author_name"/>  
            </div>
        </div>

        <Navbar />  
    </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Novel from '@/components/Novel'
import { Icon } from 'vant';
import axios from 'axios'

export default {
    components: {
        [Icon.name]: Icon,
        Navbar,
        Novel,
    },
    data() {
        return {
            classifyList: [],
            activeClassifyId: 1,
            novelList: [],
        }
    },
    async created () {
        const url = 'http://localhost:4000/api/v3/gysw/novel/classify'
        const result = await axios.get(url)
        if (result.data.code !== '0000') return
        this.classifyList = result.data.data
        this.activeClassifyId = this.classifyList[0].id
        this.queryNovels(this.activeClassifyId)
    },
    methods: {
        clickClassify (id) {
            if (id === this.activeClassifyId) return
            this.activeClassifyId = id
            this.queryNovels(id)
        },

        async queryNovels (classifyId) {
            const url = 'http://localhost:4000/api/v3/gysw/novels'
            const result = await axios.get(url, { params: { classifyId } })
            if (result.data.code !== '0000') return
            this.novelList = result.data.data
        },

        goSearchPage () {
            this.$router.push('search')
        },

        goIntroPage (novelUrl) {
            this.$router.push({ name: 'intro', params: { novelUrl } })
        }
    }
}
</script>

<style lang="scss" scoped>
.header {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.header-search {
    height: 70%;
    width: 80%;
    background-color: #ffffff;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
}
.search-placeholder {
    margin-left: 10px;
}

.classify {
    display: flex;
    flex-direction: row;
}
.classify-left {
    width: 100px;
    padding-top: 20px;
}
.classify-item {
    height: 50px;
    line-height: 50px;
    text-align: center;
}
.classify-item-active {
    background-color: #fff;
    position: relative;
}
.classify-item-active::after {
    content: '';
    position: absolute;
    top: 15px;
    right: 0;
    width: 3px;
    height: 20px;
    background-color: red;
    border-radius: 4px;
}

.classify-right {
    flex: 1;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    padding-bottom: 50px;
    height: calc(100vh - 100px);
    overflow: auto;
}
.novel-item {
    width: 40%;
    margin-bottom: 20px;
}
</style>