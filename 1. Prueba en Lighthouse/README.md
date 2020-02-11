# Taller1-PWA
## F1
Para inyectar un dato en el primer “reload” del cliente se hace uso del evento "onupgradeneeded" que se activa cuando se crea por primera vez la BD IndexDB y agrega un registro en la BD (script app.js):
![](https://github.com/nlemarodriguez/Taller1-PWA/blob/master/static/f1_1.png)

Esto garantiza que se agrega una única vez esta estación, posterior a este llamado se invoca el evento "onsuccess" que se encarga de consultar la BD y pintar en la pantalla las estaciones existentes. Cuando se recargue la página una segunda vez solo se llamará el método "onsuccess" que cargará lo existente en la BD

## F2
Para guardar una estación a manera de preferencia cuando un usuario la agrega, creé un método llamado "guardarEnIndexDB" que es invocado cuando se presiona el botón de agregar, la función de este método es guardar en IndexDB los datos relacionados con la nueva estación (script app.js):

![](https://github.com/nlemarodriguez/Taller1-PWA/blob/master/static/f2.png)

## F3
Para guardar la "App Shell" hago uso de del script "service-worker.js" donde se especifican los archivos que se van a guardar y con el método “install” se guardan en el cache:

![](https://github.com/nlemarodriguez/Taller1-PWA/blob/master/static/f3_1.png)

## F4
Se usa el service-worker.js para interceptar todos los llamados que contengan la URL: "https://api-ratp.pierre-grimaud.fr/v3/schedules/" cuando alguno de esos llamados es interceptado, se guardan los datos en un cache diferente al de los datos de la App Shell llamado: data-cache-v1:

![](https://github.com/nlemarodriguez/Taller1-PWA/blob/master/static/f4.png)

De allí en adelante siempre que esos datos son consultados se hace mediante dos llamados asíncronos, uno consulta la Red y el otra consulta si los datos están en cache:

![](https://github.com/nlemarodriguez/Taller1-PWA/blob/master/static/f4_1.png)

## F5
Para integrar nativamente las aplicaciones Android y IOS se crear el script install.js, que permite descargar la aplicación al dispositivo, tanto para el ambiente web, como en el móvil. Además se adiciona le botón "install" en la parte superior derecha con el fin de gestionar la descarga:

![](https://github.com/nlemarodriguez/Taller1-PWA/blob/master/static/f5.png)

## F6
La aplicación se encuentra desplegada en “firebase” y puede ser accedida desde la URL: https://sublime-calling-240702.web.app/

## Uso de Workbox
Para probar el uso de workbox se importa la librería y con el método registerRoute se almacena en modo CacheFirst todos los elementos del proyecto, para eso se usa la expresión regular '/.*'

![](https://github.com/nlemarodriguez/Taller1-PWA/blob/master/static/workbox.png)
