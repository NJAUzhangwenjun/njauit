<template>
  <div>
    <!-- 章节列表 -->
    <ul class="chapterList">
      <li v-for="chapter in chapterNestedList" :key="chapter.id">
        <p>{{ chapter.title }}</p>
        <!-- 视频 -->
        <ul class="chapterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-tag v-if="video.isFree" size="mini" type="success">{{ '免费观看' }}</el-tag>
              </span>
              <span class="acts">
                <el-button
                  type="text"
                  v-if="video.videoSourceId"
                  @click="toVisualVideo(video.videoSourceId)"
                >观看视频{{video.videoSourceId}}</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import chapter from "@/api/chapter";
import video from "@/api/video";

let chapterDefault = {
  courseId: "",
  id: "",
  title: "",
  sort: 0
};
let videoDefault = {
  courseId: "",
  chapterId: "",
  videoSourceId: "",
  id: "",
  title: "",
  sort: 0,
  // playCount: 0,
  // isFree:false,
  videoOriginalName: ""
};
export default {
  // 父组件向子组件传值
  data() {
    return {
      chapterNestedList: [], // 章节嵌套视频列表
      chapter: chapterDefault,
      video: videoDefault,
      courseId: ""
    };
  },

  created() {
    this.chapterId = this.$route.params.id;
    this.fetchChapterNestedListByCourseId();
  },

  methods: {
    fetchChapterNestedListByCourseId() {
      this.chapter = { ...chapterDefault };
      this.video = { ...videoDefault };
      this.video.videoOriginalName = "";
      this.chapter.courseId = this.$route.params.id;
      chapter.getNestedTreeList(this.$route.params.id).then(response => {
        this.chapterNestedList = response.data.item;
      });
    },
    toVisualVideo(videoSourceId) {
    this.$router.push({ path: "/course/videovisual/"+videoSourceId });
  }
  },
  
};
</script>

<style scoped>