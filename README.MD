# 🚀 Proyecto esaqui-backend

Este es un proyecto construido con **NestJS**, un framework progresivo para construir aplicaciones de servidor eficientes y escalables.

## 📁 Estructura del Proyecto

```
│
├── /src # Código fuente
│ ├── /common
│ ├── /subsystems #cada modulo estara en subsystema
│     └── /User   #todo sobre el usuario su entidad como modulo independiente
│     └── /Cart   #modulo del carrito 
│     └── /products #modulo de los productos
│     └── /orders # modulo de ordenes
│     └── /auth # modulo de autenticacion
│     └── /public # modulo de rutas publicas usadas por los users despuesd de autenticacion
│ ├── app.module.ts # Módulo principal
│ ├── main.ts # Archivo de entrada
│ └── /modules # Módulos de la aplicación
│ └── ejemplo # Ejemplo de módulo
│
├── /test # Pruebas
│ └── app.e2e-spec.ts # Pruebas de extremo a extremo
│
├── package.json # Dependencias y scripts
└── tsconfig.json # Configuración de TypeScript
```


## 🛠️ Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/nombre-del-proyecto.git
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd nombre-del-proyecto
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```

## 🚀 Ejecución

Para iniciar la aplicación, ejecuta: