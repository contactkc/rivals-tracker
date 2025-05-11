'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'
import { Toaster } from "@/components/ui/toaster"

export function Provider({ children }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>
        {children}
        <Toaster />
      </ColorModeProvider>
    </ChakraProvider>
  )
}
