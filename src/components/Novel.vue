<template>
    <div class="novel" @click="clickNovel">
        <img class="cover" src="../assets/images/cover.png" alt="cover">
        <div class="bookname van-multi-ellipsis--l2">{{bookName}}</div>
        <div class="authorname van-multi-ellipsis--l2">{{authorName}}</div>
        <div class="close-btn" v-if="isEdit" @click.stop="clickClose">
            <van-icon name="close" />
        </div>
    </div>
</template>

<script>
import { Icon } from 'vant'

export default {
    name: 'Novel',
    components: {
        [Icon.name]: Icon,
    },
    props: ['bookName', 'authorName', 'isEdit'],
    methods: {
        clickNovel () {
            this.$emit('click')
        },

        clickClose () {
            this.$emit('close')
        }
    }
}
</script>

<style lang="scss" scoped>
.novel {
    position: relative;

    .cover {
        width: 100%;
        height: 100%;
        box-shadow: 6px 10px 6px #ccc;
        border-radius: 8px;
    }
    .bookname {
        font-size: 17px;
        position: absolute;
        left: 10%;
        top: 20%;
    }
    .authorname {
        font-size: 13px;
        position: absolute;
        top: 70%;
        right: 10%;
    }

    .close-btn {
        position: absolute;
        top: 0px;
        right: 0px;
        background-color: #fff;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: #666666;
    }
}
</style>