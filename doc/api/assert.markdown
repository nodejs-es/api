## Assert

Este módulo es usado para escribir pruebas unitarias de sus aplicaciones, puede
acceder con `require('assert')`.

### assert.fail(actual, expected, message, operator)

Evalua si `actual` es igual a `expected` usando el operador provisto.

### assert.ok(value, [message])

Evalua si el valor es `true`, si es equivalente a `assert.equal(true, value, message);`

### assert.equal(actual, expected, [message])

Evalua la igualdad con el operador de comparación ( `==` ).

### assert.notEqual(actual, expected, [message])

Evalua la no igualdad con el operador de comparación en negación ( `!=` ).

### assert.deepEqual(actual, expected, [message])

Pruebas para las pruebas de afirmación de desigualdad profunda.

### assert.notDeepEqual(actual, expected, [message])

Pruebas para cualquier desigualdad profunda.

### assert.strictEqual(actual, expected, [message])

Pruebas de igualdad estrictas, según lo determinado por el operador de igualdad estricto ( `===` )

### assert.notStrictEqual(actual, expected, [message])

Pruebas de no igualdad estrictas, según lo determinado por el operador de no igualdad estricto ( `!==` )

### assert.throws(block, [error], [message])

Se espera lanzar un `bloque`(block) de error. El `error` puede ser un constructor, expresión regular (regexp) o 
una función de validación.

Validar instanceof usando el constructor:

    assert.throws(
      function() {
        throw new Error("Wrong value");
      },
      Error
    );

Validar un mensaje de error usando RegExp:

    assert.throws(
      function() {
        throw new Error("Wrong value");
      },
      /value/
    );

Error de validación personalizado:

    assert.throws(
      function() {
        throw new Error("Wrong value");
      },
      function(err) {
        if ( (err instanceof Error) && /value/.test(err) ) {
          return true;
        }
      },
      "unexpected error"
    );

### assert.doesNotThrow(block, [error], [message])

Se espera un `bloque` (block) y no produzca un error, vea assert.throws para más detalles.

### assert.ifError(value)

Comprueba si el valor no es falso, se produce un lanzamiento si el valor es verdadero. Muy útil
cuando se prueba el primer argumento, `error` en los callbacks.
