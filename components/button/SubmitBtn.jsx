import React from 'react'
import { Button, ButtonText } from '../ui/button'
import { LinearGradient } from '../ui/lineragradient/LinearGradient';
import { Icon } from '../ui/icon';
import { Send } from 'lucide-react-native';

const SubmitBtn = ({onPress, label}) => {
  return (
    <Button
      onPress={() => {
        if(onPress) onPress();
      }}
      className="rounded-xl p-0">
      <LinearGradient
        className="w-full  items-center py-2 px-5 rounded-xl"
        colors={['#FF6348', '#FFA502']}
        start={[0, 1]}
        end={[3, 3]}>
          <ButtonText 
          className='flex items-center gap-2'>
          
            {label}
          </ButtonText>
      </LinearGradient>
    </Button>
  )
}

export default SubmitBtn