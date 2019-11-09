import request from '@/utils/request'

export default {
  /**
   * 获取课程分类
   */
  getSubject() {
    return request({
      url: "/edu/subject",
      method: "get"
    })
    },
    /**
     * 删除节点 
     * @param {*} id 节点id
     */
    removeSubject(id) {
        return request({
            url: "/edu/subject/"+id,
            method:"delete"
        })
    },
    
    
    
    /**
     * 添加节点
     * @param {*} parentid 父节点id
     * @param {*} title 添加节点的名称
     */
    addSubject(parentid,title) {
        return request({
            url: "/edu/subject/"+parentid+"/"+title,
            method: "put"
        })
    }
}
