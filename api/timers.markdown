## Timer

### setTimeout(callback, delay, [arg], [...])

Para programar la ejecución de `callback` después de `delay` milisegundos. Devuelve un `timeoutId` para un posible uso con `clearTimeout()`. Opcionalmente, tu puedes también pasar argumentos al callback.

### clearTimeout(timeoutId)

Evita la ejecución de un callback por uno de sus disparadores.

### setInterval(callback, delay, [arg], [...])

Para programar la repetición repetitiva de un `callback` cada `delay` milisegundos. Devuelve un `intervalId` para un posible uso con `clearInterval()`. Opcionalmente, tu puedes también pasar argumentos al callback.

### clearInterval(intervalId)

Evita la ejecución de un callback por uno de sus disparadores.
