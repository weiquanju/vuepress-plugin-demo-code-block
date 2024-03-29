import mdContainer from "markdown-it-container";
import MarkdownIt from "markdown-it";
import fs from "node:fs";
import path from "path";
import highlight from "./highlight";
interface Options {
  component: string;
  componentsDir: string;
  getComponentName: (sourceFile: string) => string;
  githubEditLinkPath: string;
}

export default (options: Options) => {
  const localMd = MarkdownIt();
  const { component = "demo-block", componentsDir, getComponentName } = options;
  const componentName = component
    .replace(/^\S/, (s) => s.toLowerCase())
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase();
  return (md) => {
    md.use(mdContainer, "demo", {
      validate(params) {
        return params.trim().match(/^demo\s*(.*)$/);
      },
      render(tokens, idx) {
        const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
        if (tokens[idx].nesting === 1) {
          const description = m && m.length > 1 ? m[1] : "";
          const sourceFileToken = tokens[idx + 2];
          let sourceFile = "";
          if (
            sourceFileToken.children &&
            sourceFileToken.children[0] &&
            sourceFileToken.children[0].content
          ) {
            sourceFile = sourceFileToken.children[0].content;
          }
          let source = "";
          if (sourceFileToken.type === "inline") {
            source = fs.readFileSync(
              path.resolve(`${componentsDir}/${sourceFile}.vue`),
              "utf-8"
            );
          }
          const cptName = getComponentName(sourceFile);

          const { code, lang } = highlight(source, "vue");
          const githubLink = `${options.githubEditLinkPath}${sourceFile}.vue`;

          const encodeOptionsStr = encodeURI(JSON.stringify(options));
          let result = `<${componentName} componentName="${cptName}" :options="JSON.parse(decodeURI('${encodeOptionsStr}'))"
          description="${encodeURIComponent(localMd.render(description))}"
          code="${encodeURIComponent(code)}"
          source="${encodeURIComponent(source)}"
          lang="${lang}"
          github-link="${encodeURIComponent(githubLink)}"
          >
        `;
          return result;
        }
        return `</${componentName}>`;
      },
    });
  };
};
