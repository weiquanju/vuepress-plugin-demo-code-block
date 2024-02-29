import demoBlockContainers from "./common/containers";
import { hash, path } from "@vuepress/utils";
import prepareClientAppEnhanceFile from "./prepareClientAppEnhanceFile";
import { watch } from "chokidar";
import type { App, Plugin } from "vuepress";

interface OptionsInterface {
  components?: any;
  githubEditLinkPath?: string;
  componentsDir: string;
  componentsPatterns?: string[];
  getComponentName?: (filename: string) => string;
}

export default (option: OptionsInterface): Plugin => {
  const options = Object.assign(
    {
      components: {},
      componentsDir: null,
      componentsPatterns: ["**/*.vue"],
      githubEditLinkPath: "",
      getComponentName: (filename: string) =>
        path.trimExt(filename.replace(/\/|\\/g, "-")),
    },
    option || {}
  );
  const optionsHash = hash(options);
  const { componentsDir, componentsPatterns } = options;
  
  return (app: App) => ({
    name: "demo-block",
    multiple: true,
    clientAppEnhanceFiles: () =>
      prepareClientAppEnhanceFile(app, options, optionsHash),
    extendsMarkdown: (md, app) => {
      md.use(demoBlockContainers(options));
    },
    // watchers: Closable[], restart: () => Promise<void>
    onWatched: (app, watchers) => {
      if (componentsDir) {
        const componentsWatcher = watch(componentsPatterns, {
          cwd: componentsDir,
          ignoreInitial: true,
        });
        componentsWatcher.on("add", () => {
          prepareClientAppEnhanceFile(app, options, optionsHash);
        });
        componentsWatcher.on("unlink", () => {
          prepareClientAppEnhanceFile(app, options, optionsHash);
        });
        watchers.push(componentsWatcher);
      }
    },
  });
};
