import type { Plugin } from "vuepress";

export declare interface OptionsInterface {
  components?: any;
  githubEditLinkPath?: string;
  componentsDir: string;
  componentsPatterns?: string[];
  getComponentName?: (filename: string) => string;
}

declare const main: (option: OptionsInterface) => Plugin;

export default main;
