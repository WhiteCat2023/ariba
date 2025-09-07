import { HStack } from "../ui/hstack"
import { Icon } from "../ui/icon"
import { Pressable } from "../ui/pressable"
import { Text } from "../ui/text"
import { VStack } from "../ui/vstack"

const TabH = ({navItem, hideSideBar, router, path}) => {
  return (
    <HStack
        className={`w-full h-16 border-t bg-white justify-between sticky py-2 px-4 ${hideSideBar ? "": "hidden"}`}>
          {navItem.map(({icon, name, route}, index) => {

            const isActive = path === route

            return(
              <Pressable
                key={index}
                android_ripple={{
                  color: "#89ffa9ff"
                }}
                onPress={() => router.push(route)}>
                <VStack
                  className='items-center'>
                  <Icon 
                    as={icon} 
                    className={`text-typography-500 m-1 ${isActive ? "text-[#34A853]":"text-black"}`} 
                    size='lgl'/>
                  <Text 
                    size='xs'
                    className={`${isActive ? "text-[#34A853]":"text-black"}`} >
                    {name}
                  </Text>
                </VStack>
              </Pressable>
            )
          })}
          
      </HStack>
  )
}

export default TabH