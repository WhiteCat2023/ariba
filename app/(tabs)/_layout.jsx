import { Redirect, Slot, Tabs } from "expo-router"
import { useAuth } from "../../context/AuthContext"

export default function TabLayout() {
  const {session} = useAuth()
  return !session ? <Redirect  href="/signin"/> : <Slot/>
}


// export default function TabLayout() {
//   const { session } = useAuth()
//   console.log("Session:", session)

//   if (!session) {
//     console.log("Redirecting to signin")
//     return <Redirect href="/signin" />
//   }

//   console.log("Rendering Slot")
//   return <Slot />
// }