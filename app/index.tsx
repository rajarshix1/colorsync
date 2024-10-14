import React, { useState, useRef, useEffect } from 'react';
import { Animated, Pressable, View, Text } from 'react-native';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import ToastManager, { Toast } from 'toastify-react-native'
import tinycolor from 'tinycolor2';
// import ToastManager, { Toast } from 'toastify-react-native';

export default function App() {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [currentColor, setCurrentColor] = useState('#ffffff');
  const [nextColor, setNextColor] = useState('#ffffff');
  const [currentCompColor, setCurrentCompColor] = useState('#ffffff');
  const [nextCompColor, setNextCompColor] = useState('#ffffff');
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  //   function hexToComplimentary(hex:any){
  //     console.log('sss', hex)
  //     // Convert hex to rgb
  //     // Credit to Denis http://stackoverflow.com/a/36253499/4939630
  //     var rgb:any = 'rgb(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length/3 + '})', 'g')).map(function(l:any) { return parseInt(hex.length%2 ? l+l : l, 16); }).join(',') + ')';

  //     // Get array of RGB values
  //     rgb = rgb.replace(/[^\d,]/g, '').split(',');

  //     var r = rgb[0], g = rgb[1], b = rgb[2];

  //     // Convert RGB to HSL
  //     // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
  //     r /= 255.0;
  //     g /= 255.0;
  //     b /= 255.0;
  //     var max = Math.max(r, g, b);
  //     var min = Math.min(r, g, b);
  //     var h:any, s:any, l:any = (max + min) / 2.0;

  //     if(max == min) {
  //         h = s = 0;  //achromatic
  //     } else {
  //         var d = max - min;
  //         s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

  //         if(max == r && g >= b) {
  //             h = 1.0472 * (g - b) / d ;
  //         } else if(max == r && g < b) {
  //             h = 1.0472 * (g - b) / d + 6.2832;
  //         } else if(max == g) {
  //             h = 1.0472 * (b - r) / d + 2.0944;
  //         } else if(max == b) {
  //             h = 1.0472 * (r - g) / d + 4.1888;
  //         }
  //     }

  //     h = h / 6.2832 * 360.0 + 0;

  //     // Shift hue to opposite side of wheel and convert to [0-1] value
  //     h+= 180;
  //     if (h > 360) { h -= 360; }
  //     h /= 360;

  //     // Convert h s and l values into r g and b values
  //     // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
  //     if(s === 0){
  //         r = g = b = l; // achromatic
  //     } else {
  //         var hue2rgb = function hue2rgb(p:any, q:any, t:any){
  //             if(t < 0) t += 1;
  //             if(t > 1) t -= 1;
  //             if(t < 1/6) return p + (q - p) * 6 * t;
  //             if(t < 1/2) return q;
  //             if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  //             return p;
  //         };

  //         var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  //         var p = 2 * l - q;

  //         r = hue2rgb(p, q, h + 1/3);
  //         g = hue2rgb(p, q, h);
  //         b = hue2rgb(p, q, h - 1/3);
  //     }

  //     r = Math.round(r * 255);
  //     g = Math.round(g * 255); 
  //     b = Math.round(b * 255);

  //     // Convert r b and g values to hex
  //     rgb = b | (g << 8) | (r << 16); 
  //     return "#" + (0x1000000 | rgb).toString(16).substring(1);
  // }  

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const newColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    setNextColor(newColor)
    setCode1(newColor)
    console.log("New Color:", newColor);
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
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Pressable onPress={getRandomColor} style={{ padding: 20, alignItems: 'center', backgroundColor: "#cc99aa", borderRadius: 20 }}>
            <Text style={{ color: '#fff', fontSize: 20, }}>Generate Colour</Text>
          </Pressable>
        </View>

      </Animated.View>
    </GestureHandlerRootView>
  );
}
