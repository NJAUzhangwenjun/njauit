<template>
  <div>
    讲师列表
    <div v-for="(item,index) in items" :key="index">
      <a :href="'teacher/'+item.id">{{item.name}}</a>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    //asyncData：渲染组件之前异步获取数据
    asyncData ({ params, error }) {
      return axios.get('http://localhost:9001/edu/teacher')
        .then((response) => {
          console.log(response)// 在命令终端查看输出
          return { items: response.data.data.items}
        })
    }
  }
</script>