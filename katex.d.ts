declare module 'katex' {
  interface RenderOptions {
    displayMode?: boolean;
    throwOnError?: boolean;
    errorColor?: string;
    trust?: boolean;
    strict?: string | boolean;
    maxSize?: number;
    maxExpand?: number;
  }

  export function renderToString(expression: string, options?: RenderOptions): string;
  export function render(expression: string, container: HTMLElement, options?: RenderOptions): void;
}
