<template>
  <div>
    讲师介绍：
    {{item.id}}<br>
    {{item.name}}<br>
    {{item.intro}}<br>
  </div>
</template>
<script>
  import axios from 'axios'
  export default {
    asyncData ({ params, error }) {
      return axios.get('http://localhost:9001/edu/teacher/'+params.id)
        .then((response) => {
          console.log(response.data.data.teacher)
          return { item: response.data.data.teacher }
        })
    }
  }
</script>