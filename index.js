const _ = require('lodash');
const typeOf = require('typeof')

const ObjectId = (id) =>{
  return id;
}
const ISODate = (date) =>{
  return date;
}


const parseRootOutput = (name, obj, skip = []) => {
  const rootOutput = readObject(name, obj, skip);
  const items = recursiveRead(name, obj);
  let results = `
    ${rootOutput}
  `;
  _.forEach(items, (item)=>{
      const itemClass = readObject(item.name, _.get(obj, item.path), skip);
      results += itemClass;
  })

  return results;

}


const recursiveRead = function(name, obj, path='') {
  const Objects = [];
  const extra = path ? '.':'';
  _.forEach(Object.keys(obj), (item)=>{
    const itemName = name+_.capitalize(item)
    let itemPath = path+extra+item;
      if(typeOf(obj[item]) === 'object') {
        Objects.push({name:cleanName(itemName), path:itemPath });
        const items = recursiveRead(itemName, obj[item], itemPath)
        if(items) Objects.push(items);
      }
      if(typeOf(obj[item]) === 'array') {
        const subItem = obj[item][0]
          if(typeOf(subItem) === 'object') {
            itemPath = itemPath+`[0]`;
            const items = recursiveRead(itemName, subItem, itemPath)
            if(items) Objects.push(items);
          }
      }
      function parseObject(itemName, obj, itemPath) {

      }
  })
  if(Objects.length) return _.flatten(Objects);
}


const readObject = function (name, obj, skip) {
  let returnObj = '';

  const length = Object.keys(obj).length;
returnObj+=`\n type ${cleanName(name)} { \n`
  _.forEach(Object.keys(obj), (item, index)=>{
    if(skip.includes(item)) return
    if(item === '_id') returnObj = setRow(item, 'ID!', returnObj);
    else  {
      switch (typeOf(obj[item])) {
        case 'string':
            returnObj = setRow(item, 'String', returnObj);
          break;
        case 'number':
            returnObj = setRow(item, 'Int', returnObj);
          break;
        case 'array':
          returnObj = setRow(item, '[String]', returnObj);
        break;
        case 'boolean':
          returnObj = setRow(item, 'String', returnObj);
        break;
        case 'date':
          returnObj = setRow(item, 'String', returnObj);
        break;
        case 'object':
        returnObj += `   ${item}: ${cleanName(name)+_.capitalize(cleanName(item))} \n`
        break;
      }
    }
  });
  return setClose(returnObj);
}

const cleanName = function(name){
  return name.replace(/[^a-zA-Z ]/ig, "")
}
const setClose = function(rootOutput) {
  return rootOutput+=` }\n`; }

const setRow = function(item, value, rootOutput) {
  return rootOutput += `  ${item}: ${value} \n`
}

module.exports = function(name, json, skip) {
  if(!name || !json) return new Error('missing parameters');
  return parseRootOutput(name, json, skip);
}
