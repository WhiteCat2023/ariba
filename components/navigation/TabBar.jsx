import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useLinkBuilder, useTheme } from '@react-navigation/native';

const TabBar = ({state, description, navigation}) => {
    const { colors } = useTheme();
    const { buildHref } = useLinkBuilder();

    return (
        <View style={{ flexDirection: 'row' }}>
        {state.routes.map((route, index) => {
            const { options } = description[route.key];
            const label =
            options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
            const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
            }
            };

            const onLongPress = () => {
            navigation.emit({
                type: 'tabLongPress',
                target: route.key,
            });
            };

            return (
            <Pressable
                href={buildHref(route.name, route.params)}
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarButtonTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{ flex: 1 }}
            >
                <Text>
                {label}
                </Text>
            </Pressable>
            );
        })}
        </View>
    );
}

export default TabBar