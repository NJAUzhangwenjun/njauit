import request from '@/utils/request'

export default {
  /**
   * 根据课程ID查询章节
   * @param {*} courseId 课程id
   */
  getNestedTreeList(courseId) {
    return request({
      url: `/edu/chapter/${courseId}`,
      method: 'get'
    })
  },
}
