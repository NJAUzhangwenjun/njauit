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
   * 删除视频记录
   * @param {*} videoId 
   * @param {*} videoSourceId 
   */
  rmVideoSource(videoId,videoSourceId) {
    return request({
      // Controller中的路径
      url: '/edu/video/' + videoId/+videoSourceId,
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
  // 删除视频
  removeById(id) {
    return request({
        url: `/vidservice/vid/${id}`,
        method: 'delete'
    })
    
  },
  getPlayAuth(vid) {
    return request({
      url: `/vidservice/vid/get-play-auth/${vid}`,
      method: 'get'
    })
  }
}
