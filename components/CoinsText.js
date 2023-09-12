import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import GameContext from '../context/GameContext';
import {useSafeArea} from "react-native-safe-area-context";

function generateTextShadow(width) {
    return  Platform.select({ web: {
            textShadow: `-${width}px 0px 0px #000, ${width}px 0px 0px #000, 0px -${width}px 0px #000, 0px ${width}px 0px #000`
        }, default: {} });
}
const textShadow = generateTextShadow(4)

export default function CoinsText({ gameOver, coinsCollected }) {
    const { coinCount = 0, setCoinCount } = React.useContext(GameContext)
    coinsCollected = coinCount;

    // React.useEffect(() => {
    //     if (gameOver) {
    //         setCoinCount(0);
    //     }
    // }, [gameOver])

    const { top, left } = useSafeArea();

    return (
        <View pointerEvents="none" style={[styles.container, { top: Math.max(top, 90), left: Math.max(left, 8) }]}>
            <Text style={[styles.coinCount, textShadow]}>{coinsCollected} Coins</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
    },

    coinCount: {
        color: 'white',
        fontFamily: 'retro',
        fontSize: 30,
        backgroundColor: 'transparent',
    },
})
