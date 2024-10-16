import React, { useState, useRef, useEffect } from 'react';
import { Animated, Pressable, View, Text } from 'react-native';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import ToastManager, { Toast } from 'toastify-react-native'
import tinycolor from 'tinycolor2';
import Slider from '@react-native-community/slider';
// import ToastManager, { Toast } from 'toastify-react-native';

export default function App() {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [currentColor, setCurrentColor] = useState('#ffffff');
  const [nextColor, setNextColor] = useState('#ffffff');
  const [currentCompColor, setCurrentCompColor] = useState('#ffffff');
  const [nextCompColor, setNextCompColor] = useState('#ffffff');
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [lightness, setLightness] = useState(100); // Initial lightness value

  // Function to generate color based on lightness adjustment
  const getAdjustedColor = () => {
    const hslColor = tinycolor(nextColor).toHsl();
    // Set the lightness based on the slider value
    hslColor.l = lightness / 100; // Convert to 0-1 range
    setNextColor(tinycolor(hslColor).toHexString()) ; // Convert back to HEX
    setCode1(tinycolor(hslColor).toHexString())
    setNextCompColor(tinycolor(tinycolor(hslColor).toHexString()).spin(180).toHexString());
    setCode2(tinycolor(tinycolor(hslColor).toHexString()).spin(180).toHexString())
  };
  useEffect(() => {
    getAdjustedColor()
  }, [lightness])
  
  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const newColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    setNextColor(newColor)
    setCode1(newColor)
    console.log("New Color:", newColor);
    const color = tinycolor(newColor);
    const hsl = color.toHsl();
    setLightness( Math.round(hsl.l * 100))
    // const complementaryColor = hexToComplimentary(newColor);
    const complementaryColor = tinycolor(newColor).spin(180).toHexString();

    console.log("Complementary Color:", complementaryColor);
    setNextCompColor(complementaryColor);
    setCode2(complementaryColor)

    // return { newColor, complementaryColor };
  };
  const startColorTransition = () => {

    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      setCurrentColor(nextColor);
      setCurrentCompColor(nextCompColor);
    });
  };
  useEffect(() => {
    startColorTransition()
  }, [nextColor])


  const interpolatedColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [currentColor, nextColor],

  });

  const interpolatedCompColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [currentCompColor, nextCompColor],

  });

  const handleColor1Input = (text: string) => {
    console.log(text);
    if (text.length && text[0] !== "#") {
      text=`#${text}`
    }
    if (text.length === 7) {
      const hexValue = text.slice(1); // Remove the '#'
      const isValidHex = /^[0-9A-Fa-f]{6}$/.test(hexValue); // Regex to validate hex
      if (isValidHex) {
        setCode1(text)
        setNextColor(text);
        setNextCompColor(tinycolor(text).spin(180).toHexString());
        setCode2(tinycolor(text).spin(180).toHexString())

      } else {
        Toast.error("Invalid hex code");
      }
    }else if(text.length>7){
      Toast.error("Invalid hex code");
      setCode1(text)
    } else {
      setCode1(text)
    }
  };
  const handleColor2Input = (text: any) => {
    console.log(text[0])
    if (text.length === 1) {
      text === "#" ? setCode2(text) : setCode2(`#${text}`)
    }
    else if (text.length === 7) {
      const hexValue = text.slice(1);
      const isValidHex = /^[0-9A-Fa-f]{6}$/.test(hexValue);
      if (isValidHex) {
        setCode2(text)
        setNextCompColor(text)
        setNextColor(tinycolor(text).spin(180).toHexString())
        setCode1(tinycolor(text).spin(180).toHexString())
      } else {
        Toast.error("Invalid hex code");
      }
    }else if(text.length>7){
      Toast.error("Invalid hex code");
      setCode2(text)
    } else {
      setCode2(text)
    }
  };
  return (
    <GestureHandlerRootView>
      <Animated.View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ToastManager width={200} height={50} duration={1500} animationStyle='zoomInOut' positionValue={0}/>
      <Text>Colour</Text>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" ,paddingHorizontal: 20, width: '100%' }}>
        <Animated.View style={{ flex: 1, backgroundColor: interpolatedColor, width: "100%", justifyContent: "center", alignItems: "center" }}>
          <TextInput
            style={{
              fontSize: 20,
              color: "#000",
              padding: 5,
              backgroundColor: "#fff",
              minWidth: 100,
              textAlign: code1 ? 'center' : 'left' 
            }}
            value={code1}
            onChangeText={handleColor1Input}
            placeholder='Enter Hex code'
            placeholderTextColor="#888" 
          />
        </Animated.View>
          <Slider
          style={{ width: 300, height: 40 }}
          minimumValue={0}
          maximumValue={100}
          value={lightness}
          onValueChange={setLightness}
          step={1}
        />
        <Text>Complimentary colour</Text>
        <Animated.View style={{ flex: 1, backgroundColor: interpolatedCompColor, width: "100%", justifyContent: "center", alignItems: "center" }}>
          <TextInput
            style={{
              fontSize: 20,
              color: "#000",
              padding: 5,
              backgroundColor: "#fff",
              minWidth: 100,
              textAlign: code2 ? 'center' : 'left'
            }}
            value={code2}
            onChangeText={(handleColor2Input)}
            placeholder='Enter Hex code'
            placeholderTextColor="#888"
          />
        </Animated.View>
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Pressable onPress={getRandomColor} style={{ padding: 20, alignItems: 'center', backgroundColor: "#cc99aa", borderRadius: 20 }}>
            <Text style={{ color: '#fff', fontSize: 20, }}>Generate Colour</Text>
          </Pressable>
        </View>

      </Animated.View>
    </GestureHandlerRootView>
  );
}
