<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar" />
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像</el-button>

        <!--
          v-show：是否显示上传组件
          :key：类似于id，如果一个页面多个图片上传控件，可以做区分
          :url：后台上传的url地址
          @close：关闭上传组件
        @crop-upload-success：上传成功后的回调-->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/edu/oss/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>
      <!-- 讲师头像：TODO -->

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacher from "@/api/teacher.js";
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";

const teacherDefault = {
  name: "",
  sort: 0,
  level: 1,
  career: "",
  intro: "",
  avatar: "https://edu-njau.oss-cn-beijing.aliyuncs.com/2019/11/09/8d46e484file.png"
};

export default {
  data() {
    return {
      teacher: teacherDefault,
      saveBtnDisabled: false, // 保存按钮是否禁用,
      BASE_API: process.env.BASE_API, // 接口API地址
      imagecropperShow: false, // 是否显示上传组件
      imagecropperKey: 0 // 上传组件id
    };
  },
  components: { ImageCropper, PanThumb },
  created() {
    if (this.$route.params && this.$route.params.id) {
      const id = this.$route.params.id;
      this.getTeacherById(id);
    } else {
      this.teacher = { ...teacherDefault };
    }
  },
  methods: {
    /**修改或添加 */
    saveOrUpdate() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id;
        this.updateTeacherById(id, this.teacher);
      } else {
        this.saveBtnDisabled = true;
        this.saveData();
      }
    },
    // 保存
    saveData() {
      teacher
        .add(this.teacher)
        .then(response => {
          this.$message({
            message: "添加成功！",
            type: "success"
          });
        })
        .then(() => {
          this.$router.push({ path: "/teacher" });
        })
        .catch(error => {
          this.$message.error("添加失败！");
          this.saveBtnDisabled = false;
        });
    },
    /**根据id查询 */
    getTeacherById(id) {
      teacher.getTeacherById(id).then(response => {
        this.teacher = response.data.teacher;
      });
    },
    /**根据id修改 */
    updateTeacherById(id, teacherobj) {
      teacher
        .updateTeacherByid(id, teacher)
        .then(() => {
          this.$message({
            message: "修改成功！",
            type: "success"
          });
        })
        .then(() => {
          this.$router.push({ path: "/teacher" });
        })
        .catch(error => {
          this.$message.error("修改失败！");
          this.saveBtnDisabled = false;
        });
    },
    // 上传成功后的回调函数
    cropSuccess(data) {
      // console.log(data.imgUrl)
      this.imagecropperShow = false;
      this.teacher.avatar = data.imgUrl;
      this.imagecropperKey = this.imagecropperKey + 1;
    },

    // 关闭上传组件
    close() {
      // 关闭弹窗
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
    }
  },
  watch: {
    $route(to, from) {
      this.teacher = { ...teacherDefault };
    }
  }
};
</script>