import * as React from "react"

const MOBILE_BREAKPOINT = 768

/** Largura máxima (px) para usar Sheet na sidebar (celular + tablet). Acima: coluna fixa. */
export const SIDEBAR_SHEET_MAX_WIDTH_PX = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useSidebarSheetLayout() {
  const [sheet, setSheet] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(
      `(max-width: ${SIDEBAR_SHEET_MAX_WIDTH_PX - 1}px)`,
    )
    const onChange = () => {
      setSheet(window.innerWidth < SIDEBAR_SHEET_MAX_WIDTH_PX)
    }
    mql.addEventListener("change", onChange)
    setSheet(window.innerWidth < SIDEBAR_SHEET_MAX_WIDTH_PX)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!sheet
}
