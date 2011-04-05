/*
   File: build.js
   Custom doctool.js Node documentation
   Julius (julionc at gmail dot com)
*/

var fs = require("fs"),
    path = require("path"),
    markdown = require("./markdown"),
    argv = process.argv,
    argc = argv.length;

var _template = 'template.html',
    _folder = 'api/',
    _out = 'site/';

var template = fs.readFileSync(_template, "utf8");


function formatIdString(str) {
  str = str
    .replace(/\([^)}]*\)/gmi, "")
    .replace(/[^A-Za-z0-9_.]+/gmi, "_");

  return str.substr(0,1).toLowerCase() + str.substr(1);
}


function generateToc(data) {
  var last_level = 0
    , first_level = 0
    , toc = [
      '<div id="toc">',
      '<h2>Tabla de contenidos</h2>'
    ];

  data.replace(/(^#+)\W+([^$\n]+)/gmi, function(src, level, text) {
    level = level.length;

    if (first_level == 0) first_level = level;

    if (level <= last_level) {
      toc.push("</li>");
    }

    if (level > last_level) {
      toc.push("<ul>");
    } else if (level < last_level) {
      for(var c=last_level-level; 0 < c ; c-- ) {
        toc.push("</ul>");
        toc.push("</li>");
      }
    }

    toc.push("<li>");
    toc.push('<a href="#'+formatIdString(text)+'">'+text+'</a>');

    last_level = level;
  });

  for(var c=last_level-first_level; 0 <= c ; c-- ) {
    toc.push("</li>");
    toc.push("</ul>");
  }

  toc.push("<hr />")
  toc.push("</div>");

  return toc.join("");
}


var includeExpr = /^@include\s+([A-Za-z0-9-_]+)(?:\.)?([a-zA-Z]*)$/gmi;
// Allow including other pages in the data.
function loadIncludes(data, current_file) {
  return data.replace(includeExpr, function(src, name, ext) {
    try {
      var include_path = path.join(current_file, "../", name+"."+(ext || "markdown"))
      return loadIncludes(fs.readFileSync(include_path, "utf8"), current_file);
    } catch(e) {
      return "";
    }
  });
}


function convertData(data) {
  // Convert it to HTML from Markdown
  var html = markdown.toHTML(markdown.parse(data), {xhtml:true})
    .replace(/<hr><\/hr>/g, "<hr />")
    .replace(/(\<h[2-6])\>([^<]+)(\<\/h[1-6]\>)/gmi, function(o, ts, c, te) {
      return ts+' id="'+formatIdString(c)+'">'+c+te;
    });

  return html;
}

function generate(filename) {
  var output = template,
      html;

  fs.readFile(filename, "utf8", function(err, data) {
    if (err) throw err;

    // go recursion.
    data = loadIncludes(data, filename);
    // go markdown.
    html = convertData(data);
    filename = path.basename(filename, '.markdown');

    if (filename != "_toc" && filename != "index") {
      if (data) {
        html = generateToc(data) + "\n" + html;
      }

      output = output.replace("{{section}}", filename+" - ")
    } else {
      output = output.replace("{{section}}", "");
      output = output.replace(/<body([^>]*)>/, '<body class="'+filename+'" $1>');
    }
    if (html.length == 0) {
      html = "Sorry, this section is currently undocumented, \
but we'll be working on it.";
    }
    output = output.replace("{{content}}", html);
    fs.writeFile(_out + filename + ".html", output);
/*    if (argc > 4) {
	//fs.writeFile(argv[4], output);
	fs.writeFile(_out + filename + ".html", output);
    } else {
      process.stdout.write(output);
    }	*/
  });
}

/* build */
files = fs.readdirSync(_folder);
for(var x=0, l=files.length; x<l; x++) {
    //console.log("filename: " + _folder + files[x]);
    generate(_folder + files[x]);
}
console.log("Build it!");