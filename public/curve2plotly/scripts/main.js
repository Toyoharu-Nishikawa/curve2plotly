var curve2plotly = {
  data: null,
  jsonObj: null,
  element: null,
  init: function(id){
    this.element = document.getElementById(id);
    this.set();
  },
  makeJson: function(){
    console.log(this.data);
    let data = this.data.map((value, index, me)=>{
        console.log(value)
      name = "" + value.y[0] + " [mm]";
      return {
          "x":value.z,
          "y":value.x,
          "mode": "lines+markers",
          "type":"scatter",
          "name": name
      }
    });
    let layout = {
      "height":600,
      "width":600,
      "xaxis":{
        "title": "x [mm]"
       },
      "yaxis":{
        "title": "y [mm]"
      }
    }
    this.jsonObj = {"data":data, "layout":layout};
    console.log(this.jsonObj);
    return this;
  },
  addDownloader: function(){
    dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.jsonObj))
    downloadLink = document.createElement('a')
    downloadLink.setAttribute("href",dataStr)
    downloadLink.setAttribute("download", "data.json")
    downloadLink.click()
    return this;
  },
  set: function(){
    let self = this;
    self.element.addEventListener("change",function(e){
      let filelist = e.target.files;
      self.readFile(filelist[0], self.data).then(()=>{
          self.makeJson(self.data);
          self.addDownloader();
      });
    },false);
    return this;
  },
  readFile: function(file,data){
    return new Promise((resolve,reject)=>{
      var self = this;

      var reader = new FileReader();
      reader.addEventListener("load",function(e){
        let sections = reader.result
          .split(/\s*#.*/).filter(function(value,index,me){
          return value !="" && value != "\r\n" && value != "\n" && value != "\r";
        });
        let readData = [];
        for(section of sections){
          let sectionData = {x:[],y:[],z:[]};
          let line = section.split(/\r\n|\r|\n/);
          for(let i=0; i<line.length; i=(i+1)|0){
            if(line[i] !=""){
              let xyz = line[i].split(/\s+/).filter(function(value,index,me){
                return value !="";
              });
              sectionData.x.push(xyz[0]);
              sectionData.y.push(xyz[1]);
              sectionData.z.push(xyz[2]);
            }
          }
          readData.push(sectionData);
        }
        self.data = readData;
        reader.removeEventListener("load", arguments.callee, false);
        resolve();
      },false);
      reader.readAsText(file, 'UTF-8');
    });
  }
}

