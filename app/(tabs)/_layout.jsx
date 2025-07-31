import { Redirect, Slot } from "expo-router"
import { useAuth } from "../../context/AuthContext"

export default function TabLayout() {
  const {session} = useAuth()
  return !session ? <Redirect  href="/signin"/> : <Slot/>
}
