import yaml from "yaml"
const regex = /^---(?:\r?\n|\r)(?:([\s\S]*?)(?:\r?\n|\r))?---(?:\r?\n|\r|$)/

export const parseFrontmattter = (
  content: string
): [Record<string, unknown>, string] => {
  const match = regex.exec(content)

  if (match) {
    return [yaml.parse(match[1]), content.slice(match[0].length)]
  }

  return [{}, content]
}
