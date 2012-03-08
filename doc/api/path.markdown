# Path

    Stability: 3 - Stable

Este módulo contiene utilidades para trabajar con rutas de fichero.
Casi todos los métodos llevan sólo una transformaciones en el string.
El sistema de archivos no es consulta para comprobar si las rutas son válidos.

Utilice `require('path')` para utilizarlo.  Los siguientes métodos son provistos:

## path.normalize(p)

Normaliza la cadena de texto de una ruta, se encarga de las partes `'..'` y `'.'`.

Cuando se encuentra múltiples barras, se reemplazan por una sola;
cuando la ruta acaba en barra, se conserva.
En windows se utilizan contrabarras.

Example:

    path.normalize('/foo/bar//baz/asdf/quux/..')
    // returns
    '/foo/bar/baz/asdf'

## path.join([path1], [path2], [...])

Junta todos los argumentos y normaliza la ruta resultante.
Non-string arguments are ignored.

Example:

    path.join('/foo', 'bar', 'baz/asdf', 'quux', '..')
    // returns
    '/foo/bar/baz/asdf'

    path.join('foo', {}, 'bar')
    // returns
    'foo/bar'

## path.resolve([from ...], to)

Resuelve `to` a una ruta absoluta.

If `to` isn't already absolute `from` arguments are prepended in right to left
order, until an absolute path is found. If after using all `from` paths still
no absolute path is found, the current working directory is used as well. The
resulting path is normalized, and trailing slashes are removed unless the path 
gets resolved to the root directory. Non-string arguments are ignored.

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
    // returns
    '/foo/bar/baz'

    path.resolve('/foo/bar', '/tmp/file/')
    // returns
    '/tmp/file'

    path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif')
    // if currently in /home/myself/node, it returns
    '/home/myself/node/wwwroot/static_files/gif/image.gif'

## path.relative(from, to)

Solve the relative path from `from` to `to`.

At times we have two absolute paths, and we need to derive the relative
path from one to the other.  This is actually the reverse transform of
`path.resolve`, which means we see that:

    path.resolve(from, path.relative(from, to)) == path.resolve(to)

Ejemplos:

    path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb')
    // returns
    '..\\..\\impl\\bbb'

    path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb')
    // returns
    '../../impl/bbb'

## path.dirname(p)

Devuelve el nombre de directorio de una ruta.  Semejante al comando de Unix `dirname`.

Ejemplo:

    path.dirname('/foo/bar/baz/asdf/quux')
    // returns
    '/foo/bar/baz/asdf'

## path.basename(p, [ext])

Devuelve la última parte de una ruta.  Semejante al comando de Unix `basename`.

Ejemplo:

    path.basename('/foo/bar/baz/asdf/quux.html')
    // returns
    'quux.html'

    path.basename('/foo/bar/baz/asdf/quux.html', '.html')
    // returns
    'quux'

## path.extname(p)

Devuelve la extensión de la ruta.  Todo lo que hay después del último '.' 
en la última parte de la ruta. Si no hay '.' en la última parte de la ruta o el único 
'.' es el primer carácter, entonces devuelve un string vacío.  Ejemplos:

    path.extname('index.html')
    // returns
    '.html'

    path.extname('index.')
    // returns
    '.'

    path.extname('index')
    // returns
    ''
