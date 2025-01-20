/// <reference types="vite/client" />

// Declare *.vue files as modules
declare module '*.vue' {
    import { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }
  
  // Declare *.js files as modules (use 'any' type as a fallback for now)
  declare module '*.js' {
    const content: any;
    export default content;
  }

  
