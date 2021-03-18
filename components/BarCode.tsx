import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet} from 'react-native';

import {BarCodeScanner} from 'expo-barcode-scanner';
import { Product } from "../App";

interface Props {
  style: any;
  fetchProductData: any;
  currentProduct: Product|null;
};

const BarCode: React.FC<Props> = ({fetchProductData, currentProduct}) => {
    const [hasPermission, setHasPermission] = useState<boolean|null>(null);

    useEffect(() => {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);

    const displayLoadingText = () => {
      if(hasPermission === null) {
        return 'Requesting for camera permission.'
      } else if (hasPermission === false) {
        return 'Cannot access the camera.'
      }
    };
    
    if(!hasPermission) {
      return (
        <View style={[StyleSheet.absoluteFill, styles.text]}>
          <Text style={styles.text}>{displayLoadingText()}</Text>
        </View>
      );
    }

    return (
      <BarCodeScanner
        onBarCodeScanned={currentProduct ? undefined : fetchProductData}
        style={StyleSheet.absoluteFill}/>
    );
}

const styles = StyleSheet.create({
    text: {
      textAlign: 'center',
      alignContent: 'center',
      justifyContent: 'center',
    },
});

export default BarCode;