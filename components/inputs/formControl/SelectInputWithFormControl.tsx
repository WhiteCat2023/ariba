import TierInfoPopover from '@/components/button/TierInfoPopover'
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control'
import { Heading } from '@/components/ui/heading'
import { HStack } from '@/components/ui/hstack'
import { Icon } from '@/components/ui/icon'
import { Popover } from '@/components/ui/popover'
import { Pressable } from '@/components/ui/pressable'
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '@/components/ui/select'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import { AlertCircleIcon, ChevronDownIcon, InfoIcon } from 'lucide-react-native'
import React, { useState } from 'react'

interface SelectInputWithFormControlProps {
    heading?: string;
    subHeading?: string;
    placeholder?: string;
    errorText?: string;
    helperText?: string;
    isError?: boolean;
    tier?: { label: string; value: string }[];
    selectedValue?: string;
    onValueChange?: (value: string) => void;
}

const SelectInputWithFormControl: React.FC<SelectInputWithFormControlProps> = ({
    heading,
    subHeading,
    placeholder,
    errorText,
    helperText,
    isError = false,
    tier,
    selectedValue,
    onValueChange = () => {}
}) => {
    const [isOpenInfo, setOpenInfo] = useState(false);
    return (
        <FormControl className='mb-4 flex-1' isInvalid={isError} isRequired>
            <FormControlLabel>
                <FormControlLabelText>
                    <VStack>
                        <Text size='lg' bold>
                            {heading}
                        </Text>
                        <Text>
                            {subHeading}
                        </Text>
                    </VStack>
                </FormControlLabelText>
            </FormControlLabel>
            <HStack 
                className='items-center'
                space='lg'>
                <Select
                    className='flex-1 '
                    isInvalid={isError}
                    selectedValue={selectedValue}
                    onValueChange={onValueChange}>
                    <SelectTrigger>
                        <SelectInput placeholder={placeholder} />
                        <SelectIcon as={ChevronDownIcon} className='mr-3'/>
                    </SelectTrigger>
                    <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                            <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            {tier.map((item: { label: string; value: string }, index: React.Key) => (
                                <SelectItem key={index} label={item.label} value={item.value} />
                            ))}
                        </SelectContent>
                    </SelectPortal>
                </Select>
                {/* <Pressable
                    >
                    <Icon as={InfoIcon} className='w-6 h-6'/>
                </Pressable> */}
                <TierInfoPopover/>
                
            </HStack>
            
            <FormControlHelper>
                <FormControlHelperText>
                    {helperText}
                </FormControlHelperText>
            </FormControlHelper>
            <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>{errorText}</FormControlErrorText>
            </FormControlError>
        </FormControl>
    )
}

export default SelectInputWithFormControl