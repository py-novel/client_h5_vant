<template>
    <div>
        <van-loading v-if="!detail.bookName" class="loading" type="spinner" color="#1989fa" size="24px">
            加载中...
        </van-loading>

        <template v-else>
            <div class="info">
                <div class="info-left">
                    <img class="cover" src="../../assets/images/cover.png" alt="cover" />
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
                <div class="desc-title">小说简介</div>
                <div class="desc-content">{{detail.bookDesc}}</div>
            </div>

            <div class="btn-groups">
                <div class="btn-item btn-shelf" @click="joinShelf">加入书架</div>
            </div>
        </template>
    </div>
</template>

<script>
import { NOVEL_INTRO_GET, SHELF_ADD } from "@/configs/api"
import request from "@/utils/request"
import { Skeleton, Loading } from 'vant'

export default {
    components: {
        [Skeleton.name]: Skeleton,
        [Loading.name]: Loading,
    },
    data() {
        return {
            detail: {
                bookName: '',
                authorName: '',
                classifyName: '',
                lastUpdateAt: '',
                bookDesc: '',
                recentChapterUrl: '',
            }
        };
    },
    mounted() {
        const { novelUrl } = this.$route.params;
        this.queryNovelDetail(novelUrl);
    },
    methods: {
        async queryNovelDetail(url) {
            const result = await request({
                url: NOVEL_INTRO_GET,
                params: { url }
            });
            if (result.code !== "0000") return;
            this.detail = result.data;
        },

        async joinShelf () {
            if (!this.detail.bookName) return
            const userId = localStorage.getItem('userId')
            const { bookName, authorName, bookDesc, recentChapterUrl } = this.detail
            const result = await request({ 
                url: SHELF_ADD, 
                method: 'POST', 
                data: { 
                    userId,
                    bookName,
                    authorName,
                    bookDesc,
                    bookCoverUrl: 'https://novel.dkvirus.top/images/cover.png',
                    recentChapterUrl, 
                } 
            })
            if (result.code !== '0000') return
            this.$router.push('shelf')
        },
    }
};
</script>

<style lang="scss" scoped>
.info {
    display: flex;
    height: 140px;
    box-sizing: border-box;
    background-color: #fff;
    padding: 10px 15px;

    .info-left {
        width: 25%;

        .cover {
            width: 100%;
            height: 100%;
            border-radius: 8px;
        }
    }

    .info-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        box-sizing: border-box;
        padding: 15px 25px;
        
        .bookname {
            font-size: 23px;
        }
        
        .authorname {
            align-self: flex-end;
            font-size: 17px;
            color: #333;
        }
    }
}

.classify {
    display: flex;
    background-color: #fff;
    margin-top: 8px;
    padding: 20px 15px;
    justify-content: space-between;
    font-size: 16px;
    color: #888;
}

.desc {
    background-color: #fff;
    padding: 20px 15px;
    margin-top: 8px;

    .desc-title {
        font-size: 18px;
    }

    .desc-content {
        font-size: 14px;
        margin-top: 10px;
    }
}

.btn-groups {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;

    .btn-item {
        box-sizing: border-box;
        text-align: center;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
    }

    .btn-shelf {
        border: 1px solid #6190e8;
        background: #6190e8;
        color: #fff;
    }
}

.loading {
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -12px;
    margin-top: -12px;
}
</style>