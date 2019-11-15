<template>
    <div>
        <div class="info">
            <div class="info-left">
                <img class="cover" src="../../assets/images/cover.png" alt="cover">
            </div>
            <div class="info-right">
                <div class="bookname">{{detail.bookName}}</div>
                <div class="authorname">{{detail.authorName}}</div>
            </div>
        </div>

        <div class="classify">
            <div>最后更新时间：{{detail.lastUpdateAt}}</div>
            <div>分类：{{detail.classifyName}}</div>
        </div>

        <div class="desc">
            <div>小说简介</div>
            <div>{{detail.bookDesc}}</div>
        </div>

        <div class="btn-group">
            <div class="btn-item btn">查看目录</div>
            <div>加入书架</div>
        </div>
    </div>
</template>

<script>
import { NOVEL_INTRO_GET, NOVEL_CHAPTER_GET } from '@/configs/api'
import request from '@/utils/request'

export default {
    data () {
        return {
            detail: {
                bookName: '',
                authorName: '',
                classifyName: '',
                lastUpdateAt: '',
                bookDesc: '',
                recentChapterUrl: '',
            }
        }
    },
    mounted () {
        const { novelUrl } = this.$route.params
        this.queryNovelDetail(novelUrl)
        // this.queryChapterList(novelUrl)
    },
    methods: {
        async queryNovelDetail (url) {
            const result = await request({ url: NOVEL_INTRO_GET, params: { url } })
            if (result.code !== '0000') return
            this.detail = result.data
        },

        async queryChapterList (url) {
            const result = await request({ url: NOVEL_CHAPTER_GET, params: { url } })
            if (result.code !== '0000') return
        },
    }
}
</script>

<style lang="scss" scoped>

</style>