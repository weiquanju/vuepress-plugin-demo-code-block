// ref https://github.com/vuejs/vitepress/blob/main/src/node/markdown/plugins/highlight.ts
import escapeHtml from "escape-html";
import { highlight, languages } from "prismjs";
import chalk from "chalk";
import loadLanguages from "prismjs/components/index";

// required to make embedded highlighting work...
loadLanguages(["markup", "css", "javascript", "typescript", "python"]);

function wrap(code, lang) {
  if (lang === "text") {
    code = escapeHtml(code);
  }
  return { code, lang };
}

export default (str, lang) => {
  if (!lang) {
    return wrap(str, "text");
  }
  lang = lang.toLowerCase();
  const rawLang = lang;
  if (lang === "vue" || lang === "html") {
    lang = "markup";
  }
  if (lang === "md") {
    lang = "markdown";
  }
  if (lang === "ts") {
    lang = "typescript";
  }
  if (lang === "py") {
    lang = "python";
  }
  if (!languages[lang]) {
    try {
      loadLanguages([lang]);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(
        chalk.yellow(
          `[vitepress] Syntax highlight for language "${lang}" is not supported.`
        )
      );
    }
  }
  if (languages[lang]) {
    const code = highlight(str, languages[lang], lang);
    return wrap(code, rawLang);
  }
  return wrap(str, "text");
};
