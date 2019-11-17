<template>
    <div class="read" :style="{ backgroundColor: bgColor, color: isDark ? '#666' : '#333' }">
        <div class="header">
            {{detail.title}}
        </div>
        <div class="body" @click="menuVisible = !menuVisible">
            <div v-html="detail.content" :style="{ fontSize: font + 'px', lineHeight: font * 1.5 + 'px' }"></div>
        </div>
        <div class="footer" v-if="detail.prevUrl">
            <div @click="queryContent(detail.prevUrl, 'prev')">上一章</div>
            <div @click="queryContent(detail.nextUrl, 'next')">下一章</div>
        </div>

        <van-popup
            v-model="menuVisible"
            position="bottom"
            :style="{ height: '10%' }"
        >
            <div class="menu-list">
                <div class="menu-item" @click="showChapter">
                    <van-icon name="bars" />
                    <span>目录</span>                    
                </div>
                <div class="menu-item" @click="showSetting">
                    <van-icon name="setting" />
                    <span>设置</span>
                </div>
                <div class="menu-item" @click="switchTheme">
                    <template v-if="!isDark">
                        <van-icon name="star" />
                        <span>黑夜</span>
                    </template>

                    <template v-else>
                        <van-icon name="star-o" />
                        <span>白天</span>
                    </template>
                </div>
            </div>
        </van-popup>

        <van-popup
            v-model="settingVisible"
            position="bottom"
        >
            <div class="setting-wrap">
                <div class="font-wrap">
                    <span class="font-item">字体</span>
                    <div class="font-item" @click="font = 14">
                        <van-icon name="replay" />
                    </div>
                    <div class="font-item" @click="font = font - 2">
                        <img src="../../assets/images/setting-font-sub.png" alt="sub">
                    </div>
                    <div class="font-item" @click="font = font + 2">
                        <img src="../../assets/images/setting-font-add.png" alt="add">
                    </div>
                </div>
                <div class="bg-wrap">
                    <div v-for="bg in bgs"
                        :key="bg"
                        @click="bgColor = bg"
                        :style="{ backgroundColor: bg }"
                        class="bg-item"></div>
                </div>
            </div>
        </van-popup>

        <van-popup
            v-model="chapterVisible"
            position="left"
            :style="{ height: '100%', width: '65vw' }"
        >
            <div class="chapter-wrap">
                <div class="chapter-info">{{params.bookName}}(共{{all.length}}章)</div>
                <div class="chapter-page">
                    <div>目录({{currPage.start + 1}}-{{currPage.end + 1}})</div>
                    <div @click="isShowPage = !isShowPage">切换翻页</div>
                </div>
                <van-divider />
                <div class="chapter-list">
                    <template v-if="isShowPage">
                        <div v-for="item in page"
                            class="chapter-item"
                            @click="clickChapterPage(item)"
                            :key="item.id">
                            {{ item.desc }}
                        </div>
                    </template>
                    
                    <template v-else>
                        <div v-for="item in list"
                            @click="queryContent(item.url)"
                            :class="[{ 'chapter-item-active': item.name === detail.title.trim() } ,'chapter-item']"
                            :key="item.uuid">
                            {{ item.name }}
                        </div>
                    </template>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { NOVEL_CONTENT_GET, NOVEL_CHAPTER_GET } from '@/configs/api'
import request from '@/utils/request'
import { Popup, Icon, Divider } from 'vant'

export default {
    components: {
        [Popup.name]: Popup,
        [Icon.name]: Icon,
        [Divider.name]: Divider,
    },
    data () {
        return {
            params: {
                url: '',
                bookName: '',
                shelfId: '',
            },
            detail: {
                title: '',
                content: '',
                prevUrl: '',
                nextUrl: '',
            },

            menuVisible: false,
            isDark: false,
            
            settingVisible: false,
            bgColor: '#fff',
            font: 14,
            bgs: [
                '#fff',
                'rgb(158, 151, 167)',
                'rgb(177, 160, 132)',
                'rgb(165, 168, 185)',
                'rgb(187, 157, 171)',
            ],
        
            chapterVisible: false,
            isShowPage: false,      // 是否显示大分页
            currPage: {},
            all: [],
            page: [],       // 大分页
            list: [],       // 小分页
        }
    },
    mounted () {
        const { url, bookName, shelfId } = this.$route.params
        this.params = this.$route.params
        this.queryContent(url)

        const novelUrl = url.split('/').slice(0, 4).join('/')   // 用于查询目录
        this.queryChapterList(novelUrl)
    },
    methods: {
        async queryContent (url, info) {
            this.chapterVisible = false
            if (info && url.indexOf('.html') === -1) {
                if (info === 'prev') {
                    this.$toast('已经是第一章了')
                } else if (info === 'next') {
                    this.$toast('已经是最新章节了')
                }
                return
            }

            const result = await request({ 
                url: NOVEL_CONTENT_GET, 
                method: 'GET', 
                params: { url, shelfId: this.params.shelfId } 
            })
            if (result.code !== '0000') return
            this.detail = result.data   // title、prevUrl、nextUrl、content
        },

        async queryChapterList (url) {
            const result = await request({ url: NOVEL_CHAPTER_GET, method: 'GET', params: { url } })
            if (result.code !== '0000') return
            const chapterList = result.data


            // 拼接分页数据  288 => 2、88,,,,2880 => 28、80
            const integer = Math.floor(chapterList.length / 100)        // 整数部分
            const remainder = result.data.length % 100                  // 小数部分

            /**
             * start、end  下标从 0 开始
             * page    0-99、100-199、200-299
             */
            const page = []
            for (let i = 0; i <= integer; i++) {
                const obj = Object.create(null)
                obj.id = String(i)
                obj.start = i * 100

                if (integer === 0) {   // 只有一页，0 - 88
                    obj.end = remainder - 1
                } else if (i === integer) {  // 最后一页
                    obj.end = i * 100 + remainder - 1
                } else {
                    obj.end = (i + 1) * 100 - 1
                }

                obj.desc = `${obj.start + 1} - ${obj.end + 1}`

                page.push(obj)
            }

            this.all = chapterList
            this.page = page
            this.list = chapterList.slice(0, 100)
            this.currPage = page[0]
        },

        showChapter () {
            if (this.all.length === 0) return
            this.menuVisible = false
            this.chapterVisible = true
        },

        showSetting () {
            this.menuVisible = false
            this.chapterVisible = false
            this.settingVisible = true
        },

        switchTheme () {
            this.isDark = !this.isDark
            this.bgColor = this.isDark ? 'rgb(0, 0, 0)' : '#fff'
        },

        clickChapterPage (item) {
            this.isShowPage = !this.isShowPage
            this.list = this.all.slice(item.start, item.end + 1)
            this.currPage = item
        },
    }
}
</script>

<style lang="scss" scoped>
.read {
    height: 100vh;
    display: flex;
    flex-direction: column;
}
.header {
    height: 30px;
    line-height: 30px;
    font-size: 15px;
    box-shadow: 0 1px 5px #cccccc;
    padding-left: 20px;
}
.body {
    flex: 1;
    overflow: auto;
    padding: 10px 20px;
}
.footer {
    height: 40px;
    line-height: 40px;
    font-size: 15px;
    box-shadow: 0 -1px 5px #cccccc;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}
.footer div {
    width: 25%;
}

.menu-list {
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;

    .menu-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 16px;

        span {
            margin-top: 4px;
        }
    }
}

.setting-wrap {
    padding: 10px 20px;
    background-color: #000000;

    .font-wrap {
        font-size: 15px;
        color: #fff;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        height: 40px;
        line-height: 40px;
        margin: 20px 0;

        .font-item {
            width: 25%;
            text-align: center;

            img {
                width: 20px;
                height: 20px;
            }
        }
    }

    .bg-wrap {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        overflow: auto;
        margin-bottom: 20px;

        .bg-item {
            width: 75px;
            height: 40px;
            border-radius: 4px;
            margin-right: 10px;
        }
    }
}

.chapter-wrap {
    height: 100vh;
    display: flex;
    flex-direction: column;

    .chapter-info {
        padding: 10px;
        height: 30px;
        font-size: 18px;
    }

    .chapter-page {
        padding: 0 10px;
        height: 20px;
        display: flex;
        justify-content: space-between;
    }

    .chapter-list {
        flex: 1;
        overflow: auto;

        .chapter-item {
            padding: 10px 20px;
        }

        .chapter-item-active {
        color: rgb(171, 34, 39);
        }
    }
}
</style>