const pic = (picData) => {
  const domain = document.querySelector('#top').classList[1].substring(6)

  let result = ''
  // when icon instead of png
  if(domain == 'kanban' || domain == 'category' || domain == 'technique') {
    result = picData
  }
  else {
    if(picData == '') {
      if (domain == 'story') result == 'laika'
      else if (domain == 'diary') result = 'diary'
      else {
        result = `/imgs/foods/plate.png`
      }
    }
    else if (picData.includes(`/imgs/`)) {
      result = picData
    }
    else {
      const trimmed = picData.trim()
      const dashed = trimmed.replaceAll(' ', '-')
      let pic
      if (dashed.endsWith('.png')) {
        pic = dashed
      }
      else {
        pic = `${dashed}.png`
      }
    
      if (domain == 'recipe' || domain == 'ingredient') {
        result = `/imgs/foods/${pic}`
      }
      if (domain == 'chef' || domain == 'people') {
        result = `/imgs/people/${pic}`
      }
      if(domain == 'flash') {
        result = `/imgs/flash/${pic}`
      }
      // if(domain == 'cron') {
      //   result = `/imgs/sites/${pic}`
      // }
      if(domain == 'story' || domain == 'diary') {
        result = `/imgs/diary/${pic}`
      }
      if (domain == 'store') {
        result = `/imgs/places/${pic}`
      }
      if (domain == 'item' || domain == 'note' || domain == 'minder') {
        result = `/imgs/items/${pic}`
      }
      if (domain == 'monitor') {
        result = `/imgs/sites/${pic}`
      }
      if (domain == 'shopping') {
        result = `/imgs/lists/${pic}`
      }
    }
  }
  return result
}

export { pic }