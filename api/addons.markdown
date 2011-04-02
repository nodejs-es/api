## Addons

Addons son objetos enlazados dinamicamente. Ellos pueden ser el pegamento entre las librerias C y C++ con NodeJS. La API (en estos momentos) es algo compleja, siendo necesario el conocimiento de varias librerias.

 - V8 JavaScript, una libreria C++. Usada como interfaz con JavaScript:
  creación de objetos, llamada a funciones, etc. Documentada extensamente en fichero de cabecera `v8.h` (`deps/v8/include/v8.h` en el arbol de fuentes de Node).

 - libev, C libreria para crear un bucle de evento. En cualquier momentos que sea necesario esperar para que el descriptor de un fichero llegue a ser legible, esperar por un timer, o esperar por una señal, que llevarlo a cabo será necesario utilizar el intefez de libev. Esto es, si tu realizas cualquier I/O, necesitaras usar libev. Node usa en bucle de evento `EV_DEFAULT`. La documentación puede ser encontrada [aqui](http://cvs.schmorp.de/libev/ev.html).

 - libie, librería para manejar el pool de las hebras. Usado para hacer llamadas bloqueantes POSIX del sistema de forma asincrona. Una amplia variedad de envolturas ya existe para cada llamada, en `src/file.cc` por lo que posiblemente no tengas que usarla. Si necesitas usarla echale un vistazo al fichero de cabecera `deps/libie/eio.h`.

 - Librerias internas de Node. La más importante es la clase `node::ObjectWrap` que probablemente de la que tu desearas heredar.

 - Otras. Mira en `deps/` para cualquier cosa disponible.

Node estáticamente compila todas las dependencias dentro del ejecutable. Cuando compiles tú módulo, tu no tendrás que preocuparte sobre enlazar ninguna de estas librerias.

Para comenzar hagamos un pequeño Addon el cual hará lo siguiente in C++:

    exports.hello = 'world';

Para comenzar creamos el fichero `hello.cc`:

    #include <v8.h>

    using namespace v8;

    extern "C" void
    init (Handle<Object> target)
    {
      HandleScope scope;
      target->Set(String::New("hello"), String::New("world"));
    }

Este código fuente necesita ser construido dentro de `hello.node`, el Addon binario. Para hacer esto nosotros creamos un fichero llamado `wscript` el cual es código python y se ve como sigue:

    srcdir = '.'
    blddir = 'build'
    VERSION = '0.0.1'

    def set_options(opt):
      opt.tool_options('compiler_cxx')

    def configure(conf):
      conf.check_tool('compiler_cxx')
      conf.check_tool('node_addon')

    def build(bld):
      obj = bld.new_task_gen('cxx', 'shlib', 'node_addon')
      obj.target = 'hello'
      obj.source = 'hello.cc'

Lanzando `node-waf configure build` crearemos un fichero `build/default/hello.node` el cual es nuestro Addon.

`node-waf` es solo [WAF](http://code.google.com/p/waf), el sistema de construcción basado en python. `node-waf` is facilitado para la facilidad de los usuarios.

Todos los Addons de Node deben exportar un función llamada `init` con la siguiente constitución:

    extern 'C' void init (Handle<Object> target)

Por el momento, esta es toda la documentación sobre Addons. Por favor, mira <https://github.com/ry/node_postgres> para un ejemplo real.
