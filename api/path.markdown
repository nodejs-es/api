## Path

Este módulo contiene utilidades para trabajar con rutas de fichero.  Usa 
`require('path')` para utilizarlo.  Ofrece los siguientes métodos: 

### path.normalize(p)

Normaliza la cadena de texto de una ruta, se encarga de las partes `'..'` y `'.'`.

Cuando se encuentra múltiples barras, se reemplazan por una sola;
cuando la ruta acaba en barra, se conserva.
En windows se utilizan contrabarras.

Ejemplo:

    path.normalize('/foo/bar//baz/asdf/quux/..')
    // devuelve
    '/foo/bar/baz/asdf'

### path.join([path1], [path2], [...])

Junta todos los argumentos y normaliza la ruta resultante.

Ejemplo:

    node> require('path').join(
    ...   '/foo', 'bar', 'baz/asdf', 'quux', '..')
    '/foo/bar/baz/asdf'

### path.resolve([from ...], to)

Resuelve `to` a una ruta absoluta.

Si `to` no es absoluta los argumentos `from` se anteponen ordenados de derecha a 
izquierda, hasta que se encuentra una ruta absoluta. Si después de usar todas las rutas de `from` 
aún no se encuentra una ruta absoluta, también se utiliza el directorio actual de trabajo. La 
ruta resultante se normaliza, y se eliminan las barras finales a no ser que 
se resuelva el directorio root.

Otra manera de verlo es como una secuencia de comandos `cd` en un shell.

    path.resolve('foo/bar', '/tmp/file/', '..', 'a/../subfile')

Es como:

    cd foo/bar
    cd /tmp/file/
    cd ..
    cd a/../subfile
    pwd

La diferencia es que las distintas rutas no necesitan existir e incluso pueden 
ser ficheros.

Ejemplos:

    path.resolve('/foo/bar', './baz')
    // devuelve
    '/foo/bar/baz'

    path.resolve('/foo/bar', '/tmp/file/')
    // devuelve
    '/tmp/file'

    path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif')
    // si actualmente en /home/myself/node, devuelve
    '/home/myself/node/wwwroot/static_files/gif/image.gif'

### path.dirname(p)

Devuelve el nombre de directorio de una ruta.  Semejante al comando de Unix `dirname`.

Ejemplo:

    path.dirname('/foo/bar/baz/asdf/quux')
    // devuelve
    '/foo/bar/baz/asdf'

### path.basename(p, [ext])

Devuelve la última parte de una ruta.  Semejante al comando de Unix `basename`.

Ejemplo:

    path.basename('/foo/bar/baz/asdf/quux.html')
    // devuelve
    'quux.html'

    path.basename('/foo/bar/baz/asdf/quux.html', '.html')
    // devuelve
    'quux'

### path.extname(p)

Devuelve la extensión de la ruta.  Todo lo que hay después del último '.' 
en la última parte de la ruta. Si no hay '.' en la última parte de la ruta o el único 
'.' es el primer carácter, entonces devuelve un string vacío.  Ejemplos:

    path.extname('index.html')
    // devuelve
    '.html'

    path.extname('index')
    // devuelve
    ''

### path.exists(p, [callback])

Comprueba si existe o no la ruta.  Luego, llama al argumento `callback` 
con true o false. Ejemplo:

    path.exists('/etc/passwd', function (exists) {
      util.debug(exists ? "it's there" : "no passwd!");
    });


### path.existsSync(p)

Versión síncrona de `path.exists`.
