#Proyecto de fin de grado
##Desarrollo de Aplicaciones web

##Proyecto
El proyecto consiste en realizar una página web para una tienda online con gestion de productos, gestión de
usuarios y gestión de entrada de mercancía y facturación sin utilizar ninguna aplicación ya existente como prestashop,
woocomerce, etc..
También se desarrollará una aplicación web que se ejecutará en entorno local donde se poderán realizar ventas en la
tienda de forma física.

##Objetivos

###Gestion de usuarios

  - Sistema de roles
  - Registro / Login social (facebook, google)

###Gestion de productos
  
  - Asociados con una categoría
  - Asociados con un proveedor
  - Pueden tener diferentes opciones con attributos diferentes (talla, color, precio y referencia (OEM))
  - Creación de etiquetas para los artículos

###Gestion de entrada de mercancía

  - Crear entrada de mercancia de proveedores introduciendo la factura 

###Facturación

  - Creación de facturas de los envíos pagados
  - Creación de facturas de los tickets que se realicen en la tienda física
  - Creación de listado trimestral de facturas
  - Creación de listado anual de facturas

##Tecnologías

El proyecto se dividirá en tres partes:

###API Rest
  
  - Se creará una aplicación web que será la encargada de gestionar y mantener centralizada toda la información de la
  tienda, usuarios, productos, facturas, etc...
  - Se utilizará Java para realizar la aplicación con MySQL como base de datos.
  - Las peticiones para realizar cualquier tipo de cambio estarán restringida a usuarios con un rol específico, en caso
  de ser modificaciones en una cuenta concreta o un pedido, deberán de ser realizadas por el mismo usuario.

###Página Web

  - Se creará la página web utilizando Node.js de lado de servidor con el que nos conectaremos al API para obtener los
  datos y los renderizaremos utilizando un sistema de plantillas (Pug) y HTML5, CSS3 de lado del cliente.
  - Se utilizará LESS y Javascript ES6 con Babel utilizando Gulp para transformalo en CSS y JS respectivamente para el
  lado del cliente.
  - Responsive web design
  - AJAX para realizar funciones específicas como gestionar el carrito, etc...
  - Validación en formularios de registro de usuario, de creación de pedido, etc..
  - Versión optimizada para móviles
  - Apartado protegido para los usuarios donde pueden gestionar sus cuentas, pedidos, etc...

###Aplicación Web

  - Se creará una aplicación web utilizando Electron que se comunicará con la API Rest para obtener y enviar
  información. Desde ella se podra:

      - CRUD de productos
      - CRUD de usuarios
      - CRUD de entrada de mercancía así como marcar la mercancía como recibida
      - CRUD de pedidos
      - Gestión de ventás de forma física

## Ampliación

- RSS para novedades de productos
- Creación de contenedore docker para la aplicación
- Sistemas de deploy automatizado
- Documentación y testing de todo el proyecto
