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

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacher from "@/api/teacher.js";

export default {
  data() {
    return {
      teacher: {
        name: "",
        sort: 0,
        level: 1,
        career: "",
        intro: "",
        avatar: ""
      },
      saveBtnDisabled: false // 保存按钮是否禁用,
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      const id = this.$route.params.id;
      this.getTeacherById(id);
      console.log(id);
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
    }
  }
};
</script>