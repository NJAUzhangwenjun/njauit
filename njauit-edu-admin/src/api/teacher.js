import request from '@/utils/request'

export default {
  /**
   * 多条件组合分页查询
   * @param {*} _page 当前页
   * @param {*} _size 每页记录数
   * @param {*} _searchObject 查询条件
   */
  getTeacherPageList(_page, _size, _searchObject) {
    return request({
      // Controller中的路径
      url: '/edu/teacher/moreConditionPageList/' + _page + '/' + _size,
      method: 'post',
      // 请求的参数，（后台用了@RequestBody注解接收参数，说明要用json格式传递，所以下面所应用 data ，如果不是，要用 params ）
      data: _searchObject
    })
  },

  /**
   * 根据id删除
   * @param {*} _id id
   */
  removeDataById(_id) {
    return request({
      // Controller中的路径
      url: '/edu/teacher/' + _id,
      method: 'delete'
    })
  },

  /**
   * 添加老师
   * @param {*} teacher 老师对象数据
   */
  add(teacher) {
    return request({
      url: '/edu/teacher/addTeacher',
      method: 'post',
      data: teacher
    })
  },
  /**
   * 根据id查询 
   * @param {*} id 用户id
   */
  getTeacherById(id) {
    return request({
      url: '/edu/teacher/' + id,
      method: 'get'
    })
  },

  /**
   * 根据id修改
   * @param {*} id id
   * @param {*} teacher teacher
   */
  updateTeacherByid(id, teacher) {
    return request({
      url: '/edu/teacher/' + id,
      method: 'put',
      data: teacher
    })
  },

  /**
   * 获取老师列表
   */
  teacherList() {
    return request({
      url: '/edu/teacher',
      method: 'get'
    })
  }

}
