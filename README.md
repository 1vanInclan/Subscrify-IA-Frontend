# Subscrify Frontend 🚀

Un cliente web moderno, intuitivo y optimizado para la gestión inteligente de suscripciones y control de gastos recurrentes. Construido sobre **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, e integrado nativamente con un asistente de inteligencia artificial para análisis financiero.

---

## 📌 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Tech Stack](#-tech-stack)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Configuración e Instalación](#-configuración-e-instalación)
- [Variables de Entorno](#-variables-de-entorno)
- [Scripts Disponibles](#-scripts-disponibles)
- [Integración de IA & UI/UX](#-integración-de-ia--uiux)

---

## 📸 Características Principales

- 📊 **Dashboard Ejecutivo:** Vista general e interactiva del gasto mensual total, cantidad de servicios activos y accesos directos de gestión.
- 🗂️ **Gestión de Servicios:** Filtrado dinámico por categorías (Streaming, Cloud, Software, etc.) y búsqueda en tiempo real.
- 📈 **Gastos y Analítica:** Gráficos interactivos de distribución por categoría (Pie Chart) y comparación de costos (Bar Chart) con Recharts.
- 📅 **Calendario de Pagos:** Cronograma dinámico de próximos cobros ordenados temporalmente con indicadores visuales de vencimiento.
- 🤖 **Subscrify AI Assistant:** Widget de chat flotante en vivo para análisis financiero, sugerencias de optimización y consultas contextuales sobre servicios.
- 🌗 **Soporte Dark/Light Theme:** Alternancia fluida de tema con persistencia automática mediante `next-themes`.
- ⚡ **Acciones Rápidas con IA:** Disparo de consultas personalizadas a la IA desde las tarjetas individuales de cada servicio.
- 📱 **Diseño Responsive:** Interfaz adaptativa construida con componentes accesibles y diseño Dark Mode *first*.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router & React Server Components)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Visualización de Datos:** [Recharts](https://recharts.org/)
- **Componentes UI:** [Shadcn UI](https://ui.shadcn.com/) & [Lucide Icons](https://lucide.dev/)
- **Gestión de Estado & Tema:** `zustand` / `next-themes`
- **Gestor de Paquetes:** `pnpm`

---

## 📁 Arquitectura del Proyecto

El código está estructurado siguiendo principios de modularidad y separación de responsabilidades dentro del directorio `src/`:

```text
src/
├── app/                      # Rutas y páginas (Next.js App Router)
│   ├── (auth)/               # Rutas públicas (Login, Register)
│   ├── dashboard/            # Módulo principal del Dashboard
│   │   ├── analytics/        # Vista de Gastos y Analítica
│   │   ├── calendar/         # Vista del Calendario de Pagos
│   │   └── page.tsx          # Vista principal de Suscripciones
│   ├── layout.tsx            # Layout raíz con ThemeProvider, Sidebar y AIChatWidget
│   └── page.tsx              # Landing / Redirección
├── components/               # Componentes UI reutilizables
│   ├── ui/                   # Componentes de diseño base (Button, Input, Card)
│   ├── AIChatWidget.tsx      # Widget ejecutable del Chat con IA
│   ├── AIInsightCard.tsx     # Banner inteligente para el Dashboard
│   ├── Sidebar.tsx           # Navegación principal global
│   ├── ThemeToggle.tsx       # Selector de tema (Claro / Oscuro)
│   └── SubscriptionCard.tsx  # Tarjeta individual de suscripción
├── services/                 # Clientes HTTP e integración con APIs externas
│   ├── api.ts                # Cliente Axios configurado con JWT Interceptors
│   └── aiService.ts          # Cliente API para comunicación con el backend / IA
├── store/                    # Manejo de estado global
│   └── useSubscriptionStore.ts # Store de Zustand para sincronización de servicios
├── types/                    # Definiciones de TypeScript e Interfaces
└── lib/                      # Utilidades y configuraciones (clsx, tailwind-merge)
```

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de contar con las siguientes herramientas en tu entorno local:

- **Node.js**: `v18.17.0` o superior (se recomienda Node.js LTS).
- **npm**: gestor de paquetes por defecto del proyecto.
- **Git**: Para clonar y controlar versiones.
- **Backend Running**: Tener la API REST de Subscrify ejecutándose localmente o accesible en red.

---

## ⚙️ Configuración e Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone [https://github.com/tu-usuario/subscrify-frontend.git](https://github.com/tu-usuario/subscrify-frontend.git)
   cd subscrify-frontend
   ```

2. **Instalar dependencias:**

   ```bash
   pnpm install
   ```

3. **Iniciar el servidor de desarrollo:**

   ```bash
   pnpm dev
   ```

4. **Abrir en el navegador:**

   Visita http://localhost:8080 para ver la aplicación ejecutándose.

---

## 🔑 Variables de Entorno

Asegúrate de definir las siguientes variables en tu archivo `.env.local`:

```env
# URL Base de la API del Backend (Subscrify API)
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

---

## 📜 Scripts Disponibles

En el directorio del proyecto puedes ejecutar:

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia la aplicación en modo desarrollo con Hot Reload. |
| `npm run build` | Compila la aplicación optimizada para producción. |
| `npm run start` | Inicia el servidor de producción tras ejecutar `build`. |
| `npm lint` | Ejecuta ESLint para analizar errores y calidad del código. |

---

## 🤖 Integración de IA & UI/UX

El cliente frontend implementa comunicación asíncrona y basada en eventos para la IA:

1. **Custom Event Bus (`open-ai-chat`):** Permite invocar la ventana de chat y enviar preguntas directamente desde cualquier componente visual mediante el helper `askAI(prompt)`.
2. **Contextual Prompts:** Al hacer clic en una tarjeta específica (ej. *AWS*, *HBO*, *Spotify*), el widget abre automáticamente una sesión formulando preguntas relevantes al servicio seleccionado.
3. **Persistencia Local:** Adaptación dinámica del saludo del bot consumiendo los datos de perfil/autenticación del usuario actual.

---
