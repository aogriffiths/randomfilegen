
var tmp = require('tmp');
var fs = require('fs');

/* Valid options
 * depth = number subfolder deep to go
 * subdirs = number of subfolders to create in each parent
 * files = number of files to create in each dir
 * maxsize = max file size in kb
 * minsize = min file size in kb
 */

function generatein(parent, depth, subdirs, files, callback){
  var done;
  function done(type, err){
    done[type] = true;
    if(err){
      callback(err);
    }else if(done.files && done.subdirs){
      callback(null);
    }
  }

  //FILES
  if(files<=0){
    done("files")
  }else{
    var fileswritten = 0;
    for(var i = 0; i<files; i++){
      tmp.file({dir:parent, keep:true}, function _tempFileCreated(err, parent, fd) {
        if (err) return done("error", err);
        fs.write(fd, "randonstring", function(err){
          if (err) return done("error", err);
          fileswritten++;
          if (fileswritten == files){
            done("files");
          }
        })
      });
    }
  }
  //SUB DIRS:
  if(subdirs<=0 || depth<=1){
    done("subdirs");
  }else{
    var dirswritten = 0;
    for(var i = 0; i<subdirs; i++){
      tmp.dir({dir:parent, keep:true}, function _tempDirCreated(err, path) {
        if (err) return done("error", err);
        generatein(path, depth-1, subdirs, files, function(err){
          if (err) return done("error", err);
          dirswritten++;
          if (dirswritten == subdirs){
            done("subdirs");
          }
        })
      });
    }
  }
}
var defaults = {
  subdirs: 1,
  depth: 2,
  files: 5,
  maxsize: 200,
  minsize: 100
}
function generate(options, callback){

  var _options = Object.assign({}, defaults, options);
  tmp.dir({keep:true}, function _tempDirCreated(err, path) {
    if (err){
      callback(err)
    }else{
      generatein(path, _options.depth, _options.subdirs , _options.files, function(err){
        callback(err, path);
      })
    };
  });
}
module.exports = generate;
