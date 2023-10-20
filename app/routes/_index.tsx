import type { MetaFunction } from "@remix-run/node";
import { createContext } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Code Helper" },
    { name: "description", content: "Shibal!" },
  ];
};

const GlobalContext = createContext<any>({})

export default function Index() {
  return (<GlobalContext.Provider value={{}}>
    
  </GlobalContext.Provider>
  );
}
