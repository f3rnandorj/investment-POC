function getStringBeforeDot(input: string): string {
  return input.split(".")[0] || "";
}

export const stringUtils = { getStringBeforeDot };