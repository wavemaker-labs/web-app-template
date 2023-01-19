import type { BaristaMenuResponse } from "@wavemaker-labs/boba-sdk-ts/bobacino_protobuf/query"
import { baristaMenu } from "@wavemaker-labs/boba-sdk-ts"
import { useQuery } from "react-query"
import { useEffect, useState } from "react"
import { Outlet, useLocation, useParams, useNavigate } from "react-router-dom"
import { useRecoilValue } from "recoil"

import { customizeDrinkStore } from "@/store/customizeDrink"
import { orderStoreItemList } from "@/store/order"

interface ThemeConfig {
  [key: string]: ThemeOption
}

interface ThemeOption {
  className?: string
  style?: { [key: string]: any }
}

export default () => {
  const { baristaId } = useParams()
  const { pathname } = useLocation()

  const input = { baristaId: baristaId! }
  const { isLoading, data } = useQuery<BaristaMenuResponse>(
    ["baristaMenu", input],
    async () => baristaMenu(input),
  )

  const { menuItemId } = useRecoilValue(customizeDrinkStore)

  const [drinkBg, setDrinkBg] = useState<string>("")

  const themeConfig: ThemeConfig = {
    "customize-drink": {
      className: "text-white",
      style: { backgroundColor: drinkBg },
    },
    payment: {
      className: "text-white",
      style: { backgroundColor: "#184A48" },
    },
    success: {
      className: "text-white",
      style: { backgroundColor: "#184A48" },
    },
    default: {
      style: { backgroundColor: "#F8E9EA" },
    },
  }

  const theme = (path: string): ThemeOption => {
    const splitPath = path.split("/")
    const keyIndex = splitPath.indexOf(baristaId!) + 1
    const result = themeConfig?.[splitPath[keyIndex]] || themeConfig.default
    return result
  }
  const layoutTheme = theme(pathname)

  const renderLogo =
    !pathname.includes("/bag") &&
    !pathname.includes("/payment") &&
    !pathname.includes("/success")

  const orderItems = useRecoilValue(orderStoreItemList)

  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && menuItemId && data) {
      const item = data.menu!.items.find(i => i.id === menuItemId)
      setDrinkBg(item!.colorway!.orderScreen!.bg)
    }
  }, [menuItemId, isLoading])

  const goToBag = () => navigate(`/${baristaId}/bag`)

  return (
    <main
      id="viewport"
      className={`relative h-full overflow-hidden transition-all duration-500 ${layoutTheme.className}`}
      style={layoutTheme?.style}
    >
      {renderLogo && (
        <div className="flex items-center justify-end p-4 absolute top-0 w-full z-10">
          <div className="w-12 h-12 relative" onClick={goToBag}>
            <img src="/logo.svg" alt="Bobacino logo" />
            {orderItems.length > 0 && (
              <div
                className="rounded-full w-5 h-5
                           flex items-center justify-center
                           font-bold text-xs
                           bg-[#D7BE4F] text-white
                           absolute -top-1 -right-1"
              >
                {orderItems.length}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="overflow-auto h-full">{<Outlet />}</div>
    </main>
  )
}
