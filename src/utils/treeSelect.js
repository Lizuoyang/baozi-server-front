export function roleMenuTreeSelectMapSquare(item, checkedMenus) {
  let result = {};
  result.id = item.id;
  result.parentId = item.parentId;
  result.label = item.menuIcon + "+" + item.menuName
  result.isDisabled = item.isDelete
  result.disabled = item.isDelete
  result.type = item.menuType
  result.operations = item.operations
  let findMenu = _.find(checkedMenus, {menuId: item.id})
  let operations = _.result(findMenu, 'operations', [])
  result.checkedOperation = operations.map(x => x.id)
  if (!_.isEmpty(item.children)) {
    result.children = [];
    _.forEach(item.children, x => {
      result.children.push(roleMenuTreeSelectMapSquare(x, checkedMenus))
    });
  }
  return result
}

export function mapTreeSelectMapSquare(item) {
  let result = {};
  result.id = item.id;
  result.parentId = item.parentId;
  result.label = item.menuIcon + "+" + item.menuName
  result.isDisabled = item.isDelete
  result.disabled = item.isDelete
  result.type = item.menuType
  result.operations = item.operations
  result.checkedOperation = []
  if (!_.isEmpty(item.children)) {
    result.children = [];
    _.forEach(item.children, x => {
      result.children.push(mapTreeSelectMapSquare(x))
    });
  }
  return result
}

export function treeSelectMapSquare(item) {
  let result = {};
  result.id = item.id;
  result.parentId = item.parentId;
  result.label = item.menuIcon + "+" + item.menuName
  result.isDisabled = item.isDelete
  result.disabled = item.isDelete
  result.type = item.menuType
  if (!_.isEmpty(item.children)) {
    result.children = []
    _.forEach(item.children, x => {
      result.children.push(treeSelectMapSquare(x))
    })
  }
  return result
}

export function departmentToTree(department) {
  let result = _.cloneDeep(department);
  result.id = department.id;
  result.parentId = department.parentId;
  result.label = department.name
  result.children = null
  result.type = 'depart'
  return result;
}

export function departmentTreeMapSquare(department) {
  let result = _.cloneDeep(department);
  result.id = department.id;
  result.parentId = department.parentId;
  result.label = department.label
  if (department.children.length > 0) {
    result.children = []
    _.forEach(department.children, x => {
      result.children.push(departmentTreeMapSquare(x))
    })
  }
  return result;
}

export function memberToTree(member) {
  let result = _.clone(member);
  result.id = member.id | member.jobId;
  result.parentId = member.departmentId;
  result.label = member.name
  result.jobId = member.jobId
  result.type = 'user'
  return result;
}

export function tagsToTree (tag) {
  let result = _.clone(tag);
  result.id = _.isEmpty(tag.ecTagList) ? tag.id : tag.groupId
  result.parentId = tag.groupId;
  result.label = _.isEmpty(tag.ecTagList) ? tag.tagName : tag.groupName
  if (tag.ecTagList != null && tag.ecTagList.length > 0) {
    result.children = []
    _.forEach(tag.ecTagList, x => {
      result.children.push(tagsToTree(x))
    })
  }
  return result;
}


