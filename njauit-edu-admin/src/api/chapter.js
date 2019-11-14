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

  /**
   * 添加或修改章节信息（根据有无Id判断）
   * @param {*} chapter 章节信息
   */
  saveOrUpdateChapter(chapter) {
    return request({
      url: `/edu/chapter`,
      method: 'post',
      data: chapter
    })
  },


  /**
   * 根据章节Id获取章节信息
   * @param {*} chapterId 章节ID
   */
  getChapterByChapterId(chapterId) {
    return request({
      url: `/edu/chapter/getChapterById/${chapterId}`,
      method: 'get',
    })
  },

  /**
   * 根据章节Id删除章节信息（只有当该章节没有小节信息时才能被删除）
   * @param {*} chapterId 章节ID
   */
  deleteChapterById(chapterId) {
    return request({
      url: `/edu/chapter/${chapterId}`,
      method: 'delete',
    })
  },


}
