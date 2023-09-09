export const escapeFilename = (filename: string) => {
  return filename.replace(/ /g, "+").replace(/[^a-zA-Z0-9-_\.]/g, "")
}
