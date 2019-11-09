<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-tree
      ref="subjectTree"
      :data="subjectList"
      node-key="id"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
      :expand-on-click-node="false"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button type="text" v-show="node.level==1" size="mini" @click="() => append(data)">添加</el-button>
          <el-button type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog title="输入节点名称" :visible.sync="dialogVisible" width="30%">
      <div>
        <el-input v-model.trim="input" placeholder="请输入节点名称"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubject">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import subject from "@/api/subject.js";

// let id = 1000;

export default {
  data() {
    return {
      filterText: "", // 过滤文本
      subjectList: [], // 数据列表
      defaultProps: {
        // 属性列表数据属性的key
        children: "children",
        label: "title"
      },
      dialogVisible: false, //隐藏弹出框
      parentid: "",
      input: "",
      curentData: null
    };
  },
  // 监听 filterText的变化
  watch: {
    filterText(val) {
      this.$refs.subjectTree.filter(val); // 调用tree的filter方法
    }
  },
  created() {
    this.getSubject();
  },
  methods: {
    /** 添加 */
    append(data) {
      this.dialogVisible = true;
      this.parentid = data.id;
      this.curentData = data;
    },
    /** 向后台添加节点 */
    addSubject() {
      this.dialogVisible = false;
      subject
        .addSubject(this.parentid, this.input)
        .then(respont => {
          const newChild = {
            id: respont.data.id,
            title: this.input,
            children: []
          };
          this.input = "";
          this.curentData.children.push(newChild);
          this.$message({
            type: "success",
            message: "添加成功！"
          });
        })
        .catch(error => {
          this.$message.error("添加失败!");
          this.input = "";
        });
    },

    /**删除 */
    remove(node, data) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          subject
            .removeSubject(data.id)
            .then(success => {
              // this.getSubject();
              this.$refs.subjectTree.remove(node);
              this.$message({
                type: "success",
                message: success.message
              });
            })
            .catch(error => {
              this.$message.error("删除失败!");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 过滤节点
    filterNode(value, data) {
      if (!value) return true;
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1; //忽略大小写
    },
    /**获得分类数据 */
    getSubject() {
      subject
        .getSubject()
        .then(respont => {
          this.subjectList = respont.data.data;
        })
        .catch(error => {
          data = [];
          this.$message.error("查询失败!");
        });
    }
  }
};
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>