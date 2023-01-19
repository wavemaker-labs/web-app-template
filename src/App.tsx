import { ComponentType, ReactElement } from "react"
import { Routes, Route } from "react-router-dom"
import { ModuleNamespace } from "vite/types/hot"

import Layout from "@/pages/_Layout"

// Uses Vite's Glob Import feature
// https://vitejs.dev/guide/features.html#glob-import

interface GlobImport {
  [key: string]: ModuleNamespace
}

interface RouteObject {
  path: string
  component: ComponentType
}

const globImport: GlobImport = import.meta.glob("/src/pages/**/[a-z[]*.tsx", {
  import: "default",
  eager: true,
})

const routes: RouteObject[] = Object.keys(globImport).map(route => {
  const path = route
    .replace(/\/src\/pages|index|home|\.tsx$/g, "")
    .replace(/\[\.{3}.+\]/, "*")
    .replace(/\[(.+)\]/, ":$1")

  return { path, component: globImport[route] as unknown as ComponentType }
})

export default function App(): ReactElement {
  return (
    <Routes>
      <Route element={<Layout />}>
        {routes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Route>
    </Routes>
  )
}
