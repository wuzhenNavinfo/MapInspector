export function MP(ak) {
  return new Promise(function (resolve, reject) {
    window.init = function () {
      alert('ddd');
      resolve(BMap)
    }
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://api.map.baidu.com/api?v=2.0&ak="+ak+"&callback=init";
    script.onerror = reject;
    document.head.appendChild(script);
  })
}

export function MapBar() {
  return new Promise(function (resolve, reject) {
    window.maplet = function () {
      console.info('ssssssssss');
      resolve(Maplet)
    }
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://union.mapbar.com/apis/maps/free?f=mapi&v=31.3&k=aCW9cItqL7sqT7AxaB0zdHZoZSWmbBsuT7JhMHTsMeD6ZIl9NzFsZHT=@JBL979@Iu7lJJZWWq0IDu9xZMzMxq7I9AhH7LAAA6hqzZHZZLTbZZauxlDz7C7DD9ZCFGT=&callback=maplet";
    script.onerror = reject;
    document.head.appendChild(script);
  })
}
