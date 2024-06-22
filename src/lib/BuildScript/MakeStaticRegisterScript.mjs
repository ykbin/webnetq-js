export default function(module)
{
  const {PKG, CTLS} = module;

  let scriptContent = `import { ControlManager } from 'webnetq-js';\n\n`;

  for (const key in CTLS) {
    scriptContent += `import { default as ${key} } from '${PKG}/control/${key}';\n`;
  };
  scriptContent += `\n`;

  scriptContent += `const manager = ControlManager.getInstance();\n\n`;

  for (const key in CTLS) {
    scriptContent += `manager.register(${key})\n`;
  };
  scriptContent += `\n`;

  scriptContent += `export const PKG = '${PKG}';\n`;
  scriptContent += `export const CTLS = {\n`;
  for (const key in CTLS) {
    scriptContent += `  ${key},\n`;
  };
  scriptContent += `};\n`;

  return scriptContent;
}
