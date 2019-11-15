<template>
    <div class="novel" @click="clickNovel">
        <img class="cover" src="../assets/images/cover.png" alt="cover">
        <div class="bookname van-multi-ellipsis--l2">{{bookName}}</div>
        <div class="authorname van-multi-ellipsis--l2">{{authorName}}</div>
    </div>
</template>

<script>
export default {
    props: ['bookName', 'authorName'],
    methods: {
        clickNovel () {
            this.$emit('click')
        }
    }
}
</script>

<style lang="scss" scoped>
.novel {
    position: relative;
}

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
</style>