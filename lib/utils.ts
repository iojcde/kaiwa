import { type ClassValue, clsx } from "clsx" 
import { customAlphabet } from "nanoid"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz"
const length = 12

const nanoid = customAlphabet(alphabet, length)

export function generatePublicId() {
  return nanoid()
}

export const encodeFilename = (filename: string) => {
  return filename.replaceAll("+", " ").slice(0, -1)
}
 