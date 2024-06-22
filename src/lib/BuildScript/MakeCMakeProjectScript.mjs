export default function(content)
{
  const _projectPattern = /project *\( *([^ ]+) *([^)]*)\)/;
  const _versionPattern = /VERSION +([^ ]+)/;
  let match = content.match(_projectPattern);
  const name = match[1];
  const projectContent = match[2];
  match = projectContent.match(_versionPattern);
  const version = match[1];

  const result = {
    name,
    version,
  };

  return `export default ${JSON.stringify(result)}`;
}
