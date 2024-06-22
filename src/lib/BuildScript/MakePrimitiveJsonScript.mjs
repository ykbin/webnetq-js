export default function(module)
{
  let scriptContent = '';
  for (const key in module) {
    scriptContent += 'export ';
    scriptContent += (key == 'default') ? `default ` : `const ${key} = `;
    scriptContent += JSON.stringify(module[key]);
    scriptContent += '\n';
  }
  return scriptContent;
}
