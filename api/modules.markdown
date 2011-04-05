## Módulos

Node posee un secillo sistema de carga.  En Node, los ficheros y módulos son de
correspondencia biunívoca.  A modo de ejemplo, `foo.js` carga el módulo
`circle.js` en el mismo directorio.

El contenido de `foo.js`:

    var circle = require('./circle.js');
    console.log( 'El área de un círculo con radio 4 es '
               + circle.area(4));

El contenido de `circle.js`:

    var PI = Math.PI;

    exports.area = function (r) {
      return PI * r * r;
    };

    exports.circumference = function (r) {
      return 2 * PI * r;
    };

El módulo `circle.js` ha exportado las functiones `area()` y
`circumference()`.  Para exportar a un objeto, debe añadir el objeto especial
`exports`.


Las variables locales del módulo serán privadas. En este ejemplo la variable `PI` es
privada en `circle.js`.

### Módulos básicos

Node posee varios módulos compilados en binario.  Estos módulos son
descritos con más detalle en las siguientes secciones del documento.

Los módulos básicos son definidos en el código fuente de node en la carpeta `lib/`.

Los módulos básicos tienen la preferencia de cargarse primero si su indentificador es
pasado desde `require()`. Por ejemplo, `require('http')` siempre
devolverá lo construido en el módulo HTTP, incluso si hay un fichero con ese nombre.

### Módulo File

Si el nombre exacto del fichero no es encontrado, entonces node intentará cargar el
el nombre del fichero seguido de la extensión `.js`, y a continuación con `.node`.

Los ficheros `.js` son interpretados como ficheros de texto en JavaScript, y los ficheros `.node`
son interpretados como extensiones de módulos compilados cargados con `dlopen`.

Un módulo con el prefijo `'/'` indica la ruta absoluta al fichero.  Por
ejemplo, `require('/home/marco/foo.js')` cargará el fichero en
`/home/marco/foo.js`.

Un módulo con el prefijo `'./'` es relativo al fichero llamado con `require()`.
Es decir, `circle.js` debe estar en el mismo directorio que `foo.js` para que 
`require('./circle')` lo encuentre.

Si se omite el uso de '/' o './' en el fichero, el módulo puede ser un
"módulo básico" o se cargará desde la carpeta `node_modules`.


### Cargando desde la carpeta `node_modules`

Si el identificador del módulo pasa a `require()` no es un módulo nativo,
y no comienza con `'/'`, `'../'`, o `'./'`, entonces node inicia en el 
directorio principal del módulo actual, y añade `/node_modules`, e
intenta cargar el módulo desde esa ubicación.

Si no se encuentra, entonces se dirige al directorio principal, y así 
sucesivamente, hasta que el módulo es encontrado, hasta en la raíz del árbol es
encontrado.

Por ejemplo, si el fichero en `'/home/ry/projects/foo.js'` es llamado como
`require('bar.js')`, entonces node buscaría en las siguientes ubicaciones, en
este orden:

* `/home/ry/projects/node_modules/bar.js`
* `/home/ry/node_modules/bar.js`
* `/home/node_modules/bar.js`
* `/node_modules/bar.js`

Esto permite que los programas encuentren sus dependencias, de modo que no
entren en conflicto.


#### Optimización de proceso de búsqueda en `node_modules`

Cuando existen muchos niveles de dependencias anidadas, es posible que los
árboles de directorios tomen bastante tiempo. Las siguientes optimizaciones se
realizan para este proceso.

Primero, `/node_modules` no debe ser anexado a una carpeta ya que termina en
`/node_modules`.

Segundo, si el fichero es llamado con  `require()` ya esta en la jerarquía de
`node_modules`, entonces el nivel superior de la carpeta `node_modules` es tratada como
la raíz del árbol de búsqueda.

For example, if the file at
`'/home/ry/projects/foo/node_modules/bar/node_modules/baz/quux.js'`
called `require('asdf.js')`, then node would search the following
locations:

Por ejemplo, si el fichero en
`'/home/ry/projects/foo/node_modules/bar/node_modules/baz/quux.js'`
llama como `require('asdf.js')`, entonces node buscaría en las siguientes
ubicaciones:

* `/home/ry/projects/foo/node_modules/bar/node_modules/baz/node_modules/asdf.js`
* `/home/ry/projects/foo/node_modules/bar/node_modules/asdf.js`
* `/home/ry/projects/foo/node_modules/asdf.js`

### Carpetas como módulos

Es conveniente organizar los programas y librerías en los mismos directorios,
y proporcionar un único punto de entrar a la biblioteca.
Existe tres formas en donde una carpeta pueda usar `require()` como
un argumento.

Lo primero es crear el fichero `package.json`en la raíz de la carpeta,
que especifique el módulo `main`. Un ejemplo de package.json podría verse
como esto:


    { "name" : "some-library",
      "main" : "./lib/some-library.js" }

Si fuera una carpeta en `./some-library`, entonces
`require('./some-library')` trataría de cargar
`./some-library/lib/some-library.js`.

Este es el mayor grado de conciencia de Node con el fichero package.json .

Si no hay ningún fichero package.json presente en el directorio, entonces node
intentará cargar el fichero `index.js` o `index.node` de ese directorio.
Por ejemplo, si no hay ninguín fichero package.json en el ejemplo anterior,
entonces `require('./some-library')` intentará cargar:

* `./some-library/index.js`
* `./some-library/index.node`

### Almacenamiento en la caché

Los módulos se alamacenan en la caché después que fueron cargados por primera vez.
Esto significa (entre otras cosas) que todas las llamadas a `require('foo')` devuelve
el mismo ojecto exacto, si se resolvería en el mismo fichero

### Todos juntos...

Para obtener el nombre exacto del fichero que se cargará cuando se llame con `require()`, use
la función `require.resolve()`.

Uniendo todo lo anterior, aquí se muestra un algoritmo de alto nievel
en pseudocódigo de lo que haría require.resolve :

    require(X)
    1. Si X es módulo básico,
       a. devolver el módulo básico
       b. STOP
    2. Si X inicia con con `./` or `/`,
       a. LOAD_AS_FILE(Y + X)
       b. LOAD_AS_DIRECTORY(Y + X)
    3. LOAD_NODE_MODULES(X, dirname(Y))
    4. THROW "not found"

    LOAD_AS_FILE(X)
    1. Si X es un fichero, cargar X como texto JavaScript.  STOP
    2. Si X.js es un fichero, cargar X.js como texto JavaScript.  STOP
    3. Si X.node es un fichero, cargar X.node como extensión binaria.  STOP

    LOAD_AS_DIRECTORY(X)
    1. Si X/package.json es un fichero,
       a. Parsear X/package.json, y buscar el campo "main".
       b. let M = X + (json main field)
       c. LOAD_AS_FILE(M)
    2. LOAD_AS_FILE(X/index)

    LOAD_NODE_MODULES(X, START)
    1. let DIRS=NODE_MODULES_PATHS(START)
    2. for each DIR in DIRS:
       a. LOAD_AS_FILE(DIR/X)
       b. LOAD_AS_DIRECTORY(DIR/X)

    NODE_MODULES_PATHS(START)
    1. let PARTS = path split(START)
    2. let ROOT = index es una instancia de "node_modules" en PARTS, o 0
    3. let I = count of PARTS - 1
    4. let DIRS = []
    5. while I > ROOT,
       a. if PARTS[I] = "node_modules" CONTINUE
       c. DIR = path join(PARTS[0 .. I] + "node_modules")
       b. DIRS = DIRS + DIR
    6. return DIRS

### Cargar desde las carpetas de `require.paths`

En node, `require.paths` es un array de strings que representa las rutas de
acceso a los módulos cuando estos no tienen el prefijo `'/'`, `'./'`, o
`'../'`.  Por ejemplo, si establece require.paths como:

    [ '/home/micheil/.node_modules',
      '/usr/local/lib/node_modules' ]

A continuación se llama a `require('bar/baz.js')` y buscará en las siguientes
ubicaciones:

* 1: `'/home/micheil/.node_modules/bar/baz.js'`
* 2: `'/usr/local/lib/node_modules/bar/baz.js'`

El array en `require.paths` puede ser transformado en tiempo de ejecución para modificar
este comportamiento.

Se establece inicialmente la variable de entorno `NODE_PATH`, que contiene 
una lista delimitada por dos puntos de rutas exactas.  En el anterior ejemplo,
la variable de entorno `NODE_PATH` puedo haber sido establecido como:

    /home/micheil/.node_modules:/usr/local/lib/node_modules

Cargar las ubicaciones desde `require.paths` sólo se realiza si el
módulon no se ha encontrado desde el algoritmo `node_modules`.
Los módulos globarles son de baja prioridad para las dependencias de los paquetes.

#### **Nota:** Por favor evite la modificación de `require.paths`

Por razones de compatibilidad, `require.paths` sigue siendo la primera prioridad
en el proceso de búsqueda de módulos. Sin embargo, puede desaparecer en una próxima
versión.

Aunque parecía una buena idea en aquel tiempo, y ha permitido ser un 
experimento muy útil, en la práctica la transformación de `require.paths` es una
lista a menudo con problemas y dolores de cabeza.

##### Establecer `require.paths` a algún otro valor para nada.

Esto no hace nada de lo que se podría esperar:

    require.paths = [ '/usr/lib/node' ];

Todo lo que se hace aquí es perder la referencia *actual* de node en la búsqueda
de rutas, y crea una nueva referencia a otra cosa que no sirve
para nada.

##### Poner rutas relativas en `require.paths` es... raro.

Si hace esto:

    require.paths.push('./lib');

entonces *no* añada la ruta completa donde se resolvió `./lib`
en este sistema de ficheros.  En cambio, esto añade literalmente `'./lib'`,
lo que significa si hace `require('y.js')` en  `/a/b/x.js`, entonces se ve
en `/a/b/lib/y.js`.  Si a continuación se usa `require('y.js')` en
`/l/m/n/o/p.js`, entonces se ve en `/l/m/n/o/lib/y.js`.

En la práctica, las personas han usado esto de una manera ad hoc para la
dependencia de paquetes, pero esta técnica es frágil.

##### Cero aislamiento

Existe (debido a un diseño lamentable), sólo un array `require.paths` utilizado para
todos los módulos.

Como resultado, si un programa en node trata de confiar de este comportamiento, es posible
que de manera permanente y sutilmente altere el comportamiento de todos los programas 
escritos en node el mismo proceso. A media que el stack crece, y se reune más
funcionalidades, ya que esto es un problema con las partes que interactúan en forma
difíciles de predecir.

## Addenda: Consejos para administrar paquetes

La semántica de Node en la función `require()` fue diseñada para ser lo 
suficientemente general para soportar una serie de esctructuras de directorios.
Los paquetes de programas como `dpkg`, `rpm`, y `npm` se esperan que sean construidos 
como paquetes nativos desde los módulos de Node sin modificaciones.

A continuación sugerimos una estructura en la que puede trabajar:

Supongamos que se desea tener en 
`/usr/lib/node/<some-package>/<some-version>` se mantenga el contenido de una
versión específica de un paquete.

Los paquetes pueden depender uno del otro. Con el fin de instalar el paquete `foo`, 
puede que tenga que instalar una versión específica del paquete `bar`.  El paquete
 `bar` puede tener dependencias, y en algunos casos, estas dependencias, incluso pueden 
entrar en conflicto o crear ciclos.

Desde la búsqueda con Node de la `ruta` de cualquier módulo cargado (es decir,
resueltos los enlaces simbólicos), y luego de buscar sus dependencias en la
carpeta `node_modules` como se describió anteriormente, esta situación es muy simple de 
resolver con la siguiente arquitectura:

* `/usr/lib/node/foo/1.2.3/` - Contenido del paquete `foo`, versión 1.2.3.
* `/usr/lib/node/bar/4.3.2/` - Contenido del paquete `bar` que es
  dependencia de `foo`.
* `/usr/lib/node/foo/1.2.3/node_modules/bar` - Enlace simbólico a
  `/usr/lib/node/bar/4.3.2/`.
* `/usr/lib/node/bar/4.3.2/node_modules/*` - Enlaces simbólicos a los paquetes
  que `bar` depende.

Por lo tanto, incluso si se encuentra, o si hay problemas de dependencias,
cada módulo será capza de obtener una versión de su dependencia para ser
utilizada.

Cuando el código en el paquete `foo` utiliza `require('bar')`, se obtendrá la
versión al enlace simbólico en `/usr/lib/node/foo/1.2.3/node_modules/bar`.
Luego, cuando el código del paquete `bar` llame a `require('quux')`, obtendrá
la versión simbólica en `/usr/lib/node/bar/4.3.2/node_modules/quux`.

Además, para hacer el proceso de búsqueda del módulo aún más óptima, en lugar
de poner los paquetes directamente en `/usr/lib/node`, se puede poner estos en
`/usr/lib/node_modules/<name>/<version>`.  Entonces node no se molestará en
buscar por dependencias no encontradas en `/usr/node_modules` o `/node_modules`.

A fin de que los módulos disponibles para node en REPL, puedan ser útiles,
añade también la carpeta `/usr/lib/node_modules` a la variable de entorno `$NODE_PATH`.
Desde el módulo de búsquedas usando la carpeta `node_modules` donde todo es
relativo, y basado en la ruta real de los ficheros llamados por `require()`, 
los paquetes pueden ser llamado desde cualquier lugar.
