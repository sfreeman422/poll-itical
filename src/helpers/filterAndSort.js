const filterAndSort = data => {
  const mapObj = {};
  for (let i = 0; i < data.length; i++) {
    if (mapObj[data[i].type]) {
      mapObj[data[i].type].push(data[i]);
    } else {
      mapObj[data[i].type] = [data[i]];
    }
  }
  sort(mapObj);
  return mapObj;
};

const sort = obj => {
  Object.keys(obj).forEach(key =>
    obj[key].sort((a, b) => {
      return new Date(a.endDate) - new Date(b.endDate);
    })
  );
};

export default filterAndSort;
