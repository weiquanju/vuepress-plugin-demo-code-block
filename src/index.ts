const demoBlockContainers = require("./common/containers");
const { hash, path } = require("@vuepress/utils");
const prepareClientAppEnhanceFile = require("./prepareClientAppEnhanceFile");
const chokidar = require("chokidar");

interface OptionsInterface {
  components?: any;
  githubEditLinkPath?: string;
  componentsDir: string;
  componentsPatterns?: string[];
  getComponentName?: (filename: string) => string;
}

export default (option: OptionsInterface) => {
  const options = Object.assign(
    {
      components: {},
      componentsDir: null,
      componentsPatterns: ["**/*.vue"],
      githubEditLinkPath: '',
      getComponentName: (filename) =>
        path.trimExt(filename.replace(/\/|\\/g, "-")),
    },
    option || {} as OptionsInterface
  );
  const optionsHash = hash(options);
  const { componentsDir, componentsPatterns } = options;
  return (app) => ({
    name: 'demo-block',
    multiple: true,
    clientAppEnhanceFiles: () =>
      prepareClientAppEnhanceFile(app, options, optionsHash),
    extendsMarkdown: (md, app) => {
      md.use(demoBlockContainers(options));
    },
    onWatched: (app, watchers) => {
      if (componentsDir) {
        const componentsWatcher = chokidar.watch(componentsPatterns, {
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
