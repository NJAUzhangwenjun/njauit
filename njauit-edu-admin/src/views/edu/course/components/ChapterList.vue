<template>
  <div>
    <!-- 添加章节按钮 -->
    <div>
      <el-button style="width:100%" @click="dialogVisible = true">添加章节</el-button>
    </div>
    <!--添加章节对话框弹框-->
    <el-dialog title="添加章节" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form ref="chapter" :model="chapter" label-width="80px">
        <el-form-item label="章节名称">
          <el-input v-model="chapter.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="chapter.sort" placeholder="排序">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertChapter">确 定</el-button>
      </span>
    </el-dialog>

    <!--添加小节对话框弹框-->
    <el-dialog
      title="添加小节"
      :visible.sync="dialogVideoVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="video" :model="video" label-width="80px">
        <el-form-item label="小节名称">
          <el-input v-model="video.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="video.sort" placeholder="排序">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertVideo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 章节列表 -->
    <ul class="chapterList">
      <li v-for="chapter in chapterNestedList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="addvideo(chapter.id)">添加课时</el-button>
            <el-button type="text" @click="editChapter(chapter.id)">编辑</el-button>
            <el-button type="text" @click="delChapter(chapter.id)">删除</el-button>
          </span>
        </p>
        <!-- 视频 -->
        <ul class="chapterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-tag v-if="video.isFree" size="mini" type="success">{{ '免费观看' }}</el-tag>
                <el-button type="text" @click="editVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="delVideo(video.id)">删除</el-button>
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
  id: "",
  title: "",
  sort: 0
  // playCount: 0,
  // isFree:false,
};
export default {
  // 父组件向子组件传值
  props: {
    courseId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      chapterNestedList: [], // 章节嵌套视频列表
      chapter: chapterDefault,
      dialogVisible: false,
      dialogVideoVisible: false,
      options: [
        {
          value: 0,
          label: "正序"
        },
        {
          value: 1,
          label: "倒序"
        }
      ],
      video: videoDefault
    };
  },

  created() {
    this.fetchChapterNestedListByCourseId();
  },

  methods: {
    fetchChapterNestedListByCourseId() {
      this.chapter = { ...chapterDefault };
      this.video = { ...videoDefault };
      this.chapter.courseId = this.courseId;
      chapter.getNestedTreeList(this.courseId).then(response => {
        this.chapterNestedList = response.data.item;
      });
    },
    /** 弹出框 */
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    /** 修改 */
    editChapter(chapterId) {
      chapter.getChapterByChapterId(chapterId).then(success => {
        this.chapter = success.data.chapter;
        this.dialogVisible = true;
      });
    },
    /** 删除 */
    delChapter(chapterId) {
      this.$confirm("确认要删除该章节？（只能删除没有小节的章节）")
        .then(_ => {
          return chapter.deleteChapterById(chapterId);
        })
        .then(success => {
          this.fetchChapterNestedListByCourseId();
          this.$message.success("删除成功");
        })
        .catch(_ => {
          this.$message.error("删除失败");
        });
    },
    /** 添加/修改 */
    insertChapter() {
      this.dialogVisible = false;
      chapter
        .saveOrUpdateChapter(this.chapter)
        .then(success => {
          this.$message.success(success.message);
          this.fetchChapterNestedListByCourseId();
        })
        .catch(error => {
          this.$message.error(error.message);
        });
    },
    /** 添加video */
    insertVideo() {
      this.dialogVideoVisible = false;
      video
        .saveOrUpdateVideo(this.video)
        .then(success => {
          this.fetchChapterNestedListByCourseId();
          this.$message.success(success.message);
        })
        .then(error => {
          this.$message.error(error.message);
        });
    },
    addvideo(chapterId) {
      this.video.chapterId = chapterId;
      this.video.courseId = this.courseId;
      this.dialogVideoVisible = true;
    },
    editVideo(videoId) {
      video
        .getVideoById(videoId)
        .then(success => {
          this.video = success.data.video;
          this.dialogVideoVisible = true;
        })
        .catch(error => {
          this.$message.error(error.message);
        });
    },
    /** 删除小节 */
    delVideo(videoId) {
      this.$confirm("确认要删除该小节？")
        .then(_ => {
          return video.deleteVideoById(videoId);
        })
        .then(success => {
          this.fetchChapterNestedListByCourseId();
          this.$message.success("添加成功");
        })
        .catch(error => {
          this.$message.error("删除失败");
        });
    }
  }
};
</script>

<style scoped>
.chapterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chapterList li {
  position: relative;
}
.chapterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chapterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dashed #ddd;
}
</style>