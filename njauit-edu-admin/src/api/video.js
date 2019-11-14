import request from '@/utils/request'

export default {
  /**
   * 添加/修改
   * @param {*} video 
   */
  saveOrUpdateVideo(video) {
    return request({
      // Controller中的路径
      url: '/edu/video/',
      method: 'post',
      data: video
    })
  },
  /**
   * 查询
   * @param {*} id 
   */
  getVideoById(id) {
    return request({
      // Controller中的路径
      url: '/edu/video/' + id,
      method: 'get',
    })
  },


  /**
   * 删除
   * @param {*} id 
   */
  deleteVideoById(id) {
    return request({
      // Controller中的路径
      url: '/edu/video/' + id,
      method: 'delete',
    })
  },
}
