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

        <el-form-item label="上传视频">
          <el-upload
            ref="upload"
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/vidservice/vid/upload'"
            :limit="1"
            class="upload-demo"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，
                <br />支持3GP、ASF、AVI、DAT、DV、FLV、F4V、
                <br />GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、
                <br />MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、
                <br />SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>
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
      video: videoDefault,
      fileList: [], //上传文件列表
      BASE_API: process.env.BASE_API // 接口API地址
    };
  },

  created() {
    this.fetchChapterNestedListByCourseId();
  },

  methods: {
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleVodRemove(file, fileList) {
      console.log(file);
      video.removeById(this.video.videoSourceId).then(response => {
        this.$message({
          type: "success",
          message: response.message
        });
        video
          .rmVideoSource(this.video.videoId, this.video.videoSourceId)
          .then(() => {
            this.fetchChapterNestedListByCourseId();
          });
      });
    },

    //成功回调
    handleVodUploadSuccess(response, file, fileList) {
      this.video.videoSourceId = response.data.videoId;
      this.video.videoOriginalName = file.name;
    },
    //上传多于一个视频

    handleUploadExceed(files, fileList) {
      this.$message.warning("想要重新上传视频，请先删除已上传的视频");
    },

    fetchChapterNestedListByCourseId() {
      this.chapter = { ...chapterDefault };
      this.video = { ...videoDefault };
      this.video.videoOriginalName = "";
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
      // this.video.chapterId = chapterId;
      this.video.courseId = this.courseId;
      video
        .saveOrUpdateVideo(this.video)
        .then(success => {
          this.fetchChapterNestedListByCourseId();
          this.$message.success(success.message);
        })
        .then(error => {
          this.$message.error(error.message);
        });
      this.video.videoOriginalName = "";
    },
    addvideo(chapterId) {
      // this.video.videoId = "";
      this.video = { ...videoDefault };
      this.video.chapterId = chapterId;
      this.video.videoOriginalName = "";
      this.dialogVideoVisible = true;
    },
    editVideo(videoId) {
      // this.video.videoOriginalName = "";
      video
        .getVideoById(videoId)
        .then(success => {
          this.video = success.data.video;
          if (this.video.videoSourceId && this.video.videoOriginalName) {
            this.fileList = [{ name: this.video.videoOriginalName }];
          } else if (
            this.video.videoSourceId &&
            this.video.videoOriginalName == ""
          ) {
            this.fileList = [{ name: "视频" + this.video.videoSourceId }];
          }

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
          this.video.videoOriginalName = "";
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