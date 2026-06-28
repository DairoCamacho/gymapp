# GymApp

GymApp es una aplicación web integral diseñada para la administración y control de gimnasios. Cuenta con una arquitectura cliente-servidor, donde el frontend está construido en **React (Vite)** con **TailwindCSS** para un diseño moderno y ágil, y el backend está desarrollado en **Java con Spring Boot**, exponiendo una API REST robusta que se conecta a una base de datos **MySQL**.

## 🏋️‍♂️ ¿Qué se puede hacer en GymApp?

El sistema está dividido en cuatro módulos principales:

1. **Usuarios:** Permite registrar clientes, editar su información y darlos de baja (soft-delete). Un usuario dado de baja no podrá registrar asistencias.
2. **Planes:** Permite crear planes de suscripción para el gimnasio (ej. Mensual, Semestral, Estudiante) configurando su precio y duración en días. Los planes se pueden desactivar para que no sigan ofreciéndose a nuevos clientes.
3. **Membresías:** Es el núcleo del negocio. Permite asignar un Plan a un Usuario. El sistema calcula automáticamente la fecha de expiración. Puedes anular una membresía si el usuario decide cancelarla antes de tiempo.
4. **Asistencias:** Permite llevar el registro diario (log de entradas) de los usuarios al establecimiento.

Adicionalmente, el sistema cuenta con un **Panel de Historial** global donde quedan registrados todos los movimientos de anulación, desactivación y eliminación (soft-delete) de la base de datos para mantener una trazabilidad transparente.

---

## 🚀 Instalación y Ejecución

Sigue estos pasos en orden para levantar el entorno de desarrollo local:

### 1. Base de Datos (Docker)
El proyecto incluye un entorno preconfigurado de Docker para levantar la base de datos MySQL sin necesidad de instalar el motor localmente.
1. Abre una terminal y dirígete a la carpeta `docker`:
   ```bash
   cd docker
   ```
2. Levanta el contenedor de la base de datos en segundo plano:
   ```bash
   docker-compose up -d
   ```

### 2. Backend (Spring Boot)
El servidor en Java contiene la lógica de negocio y provee la API REST en el puerto `8080`.
1. Dirígete a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Compila y ejecuta el proyecto usando el wrapper de Maven incluido:
   ```bash
   ./mvnw spring-boot:run
   ```
*(Nota: En Windows, si `./mvnw` no funciona, puedes usar `.\mvnw.cmd spring-boot:run` o ejecutar la clase principal desde tu IDE como IntelliJ/Eclipse).*

### 3. Frontend (React + Vite)
El cliente web provee la interfaz visual y corre por defecto en el puerto `5173`.
1. Abre una nueva terminal y dirígete a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias de Node.js:
   ```bash
   npm install
   ```
3. Levanta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre tu navegador web y visita: `http://localhost:5173`