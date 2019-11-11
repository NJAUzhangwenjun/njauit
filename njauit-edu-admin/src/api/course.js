import request from '@/utils/request'
export default {

  /**
   * 添加课程基本信息
   * @param {*} courseInfo 课程基本信息
   */
  addCourseInfo(courseInfo) {
    return request({
      url: "/edu/course/save-course-info",
      method: "post",
      data: courseInfo
    })
  },

  /**
   * 根据Id查询课程信息
   * @param {*} courseId courseId 
   */
  getCourseInfoById(courseId) {
    return request({
      url: '/edu/course/' + courseId,
      method: 'get'
    })
  },
  /**
   * 根据id跟新
   * @param {*} courseInfo 根据id跟新
   */
  updateCourseInfoById(courseInfo) {
    return request({
      url: '/edu/course/',
      method: 'put',
      data: courseInfo
    })
  },
  getPageList(page, limit, searchObj) {
    return request({
      url: `/edu/course/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },
}
