export const deepCopy = function(obj){

    if (typeof obj !== 'object' || obj === null) return

    let newObj = obj instanceof Array ? [] : {}

    for(let key in obj){
      if(typeof obj[key]==='object' && obj[key] !== null){
        //创建一个新的对象
        newObj[key] = deepCopy(obj[key])
      } else {
        newObj[key] = obj[key]
      }
    }

    return newObj
}

export const completeDateString = function(date){
    if(+date < 10){
        return '0' + date
    }

    return date
}