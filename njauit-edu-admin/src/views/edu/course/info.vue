<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="active" finish-status="success" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="发布课程" />
    </el-steps>

    <!-- 课程信息表单 TODO -->
    <!-- 课程信息表单 -->
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写" />
      </el-form-item>

      <!-- 所属分类 TODO -->
      <!-- 所属分类：级联下拉列表 -->
      <el-form-item label="课程类别">
        <!-- 一级分类 -->
        <el-select
          @change="subjectLevelOneChanged"
          v-model="courseInfo.subjectParentId"
          placeholder="请选择"
        >
          <el-option
            v-for="subject in subjectNestedList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in subSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择课程讲师">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介 TODO -->
      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>

      <!-- 课程封面 TODO -->
      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/edu/oss/upload'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" />
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />元
      </el-form-item>
    </el-form>

    <div style="text-align:center">
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next()">保存并下一步</el-button>
    </div>
  </div>
</template>

<script>
import course from "@/api/course.js";
import teacher from "@/api/teacher.js";
import subject from "@/api/subject.js";
import Tinymce from "@/components/Tinymce";

const defaultForm = {
  title: "",
  subjectId: "",
  subjectParentId: "",
  teacherId: "",
  lessonNum: 0,
  description: "",
  cover:
    "https://edu-njau.oss-cn-beijing.aliyuncs.com/2019/11/12/adabbdf3favicon (2).ico",
  price: 0
};

export default {
  components: { Tinymce },
  data() {
    return {
      active: 0,
      saveBtnDisabled: false,
      courseInfo: defaultForm,
      teacherList: [],
      subjectNestedList: [], //一级分类列表
      subSubjectList: [], //二级分类列表
      BASE_API: process.env.BASE_API // 接口API地址
    };
  },
  created() {
    this.courseInfo = { ...defaultForm };
    if (this.$route.params && this.$route.params.id) {
      this.getCourseInfoById(this.$route.params.id);
    } else {
      this.getSubject();
    }
    this.getTeacherList();
  },
  methods: {
    // 图片上传前调用函数
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    //   图片上传成功后回调函数
    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.data.imgUrl;
    },
    /**获取courseInfo数据 */
    getCourseInfoById(courseId) {
      course
        .getCourseInfoById(courseId)
        .then(respont => {
          this.courseInfo = respont.data.courseInfo;
        })
        .catch(error => {});
      this.getSubject();
      // 填充二级菜单：遍历一级菜单列表，
      // 填充二级菜单：遍历一级菜单列表，
      for (let i = 0; i < this.subjectNestedList.length; i++) {
        // 找到和courseInfo.subjectParentId一致的父类别记录
        if (this.subjectNestedList[i].id === this.courseInfo.subjectParentId) {
          // 拿到当前类别下的子类别列表，将子类别列表填入二级下拉菜单列表
          this.subSubjectList = this.subjectNestedList[i].children;
        }
      }
    },

    // 下一步
    next() {
      this.saveBtnDisabled = true;
      if (this.$route.params && this.$route.params.id) {
        // 修改
        this.updateCourseInfoById(this.courseInfo);
        // TODO:
      } else {
        // 添加
        this.addCourseInfo(this.courseInfo);
      }
    },

    /**跟新操作 */
    updateCourseInfoById(courseInfo) {
      course
        .updateCourseInfoById(courseInfo)
        .then(response => {
          this.$message.success("修改成功，请进行下一步操作！");
          this.$router.push({
            path: "/course/chapter/" + response.data.courseId
          });
        })
        .catch(error => {
          console.log(JSON.stringify(error));
          this.$message.error("添加失败，请重新输入并保证信息正确！");
        });
    },
    /** 添加课程信息 */
    addCourseInfo(courseInfo) {
      course
        .addCourseInfo(courseInfo)
        .then(response => {
          this.$message.success("添加成功，请进行下一步操作！");
          this.$router.push({
            path: "/course/chapter/" + response.data.courseId
          });
        })
        .catch(error => {
          console.log(JSON.stringify(error));
          this.$message.error("添加失败，请重新输入并保证信息正确！");
        });
    },
    /**获取讲师列表 */
    getTeacherList() {
      teacher
        .teacherList()
        .then(respont => {
          this.teacherList = respont.data.items;
        })
        .catch(error => {});
    },
    getSubject() {
      subject
        .getSubject()
        .then(respont => {
          this.subjectNestedList = respont.data.data;
        })
        .catch(error => {});
    },
    subjectLevelOneChanged(value) {
      for (let i = 0; i < this.subjectNestedList.length; i++) {
        if (this.subjectNestedList[i].id === value) {
          this.subSubjectList = this.subjectNestedList[i].children;
          this.courseInfo.subjectId = "";
        }
      }
    }
  }
};
</script>   
<style scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}
</style>