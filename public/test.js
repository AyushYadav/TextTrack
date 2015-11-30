var fs = require('fs');

function getFiles (dir, files_){
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files){
      var name = dir + '/' + files[i];
      if (fs.statSync(name).isDirectory()){
          getFiles(name, files_);
      } else {
          files_.push(name);
      }
  }
  return files_;
}

var files=getFiles('files');

/*for (index = 0; index < files.length; index++) {
    file.appendChild(files[index]);
}*/

var stream = fs.createWriteStream("my_file.txt");
stream.once('open', function(fd) {
  stream.write(JSON.stringify(files));
  stream.end();
});

/*var fileT = new File('ayu.txt')
fileT.write(files);*/

console.log(files);