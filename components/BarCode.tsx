import React, {Component, useEffect, useState} from "react";
import {Text, View, StyleSheet, Button} from 'react-native';

// Expo tools.
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';

// RxJS.
import {of} from 'rxjs';
import {fromFetch} from 'rxjs/fetch';
import {switchMap} from 'rxjs/operators';

type Props = {
  productList: string[],
  setProductList: any
};

const API_URL = 'https://www.gtinsearch.org/api/items'

const BarCode = ({productList, setProductList}: Props) => {
    const [hasPermission, setHasPermission] = useState<boolean|null>(null);
    const [scanned, setScanned] = useState(false);

    const fetchProductData = (EAN: string) => {
      const URL = `${API_URL}/${EAN}`;
      fromFetch(URL)
        .pipe(switchMap(resp => {
            if (resp.ok) return resp.json()
            else return of({error: true, message: `Error: ${resp.status}`})
        }))
        .subscribe(data => {
          handleAddProduct(data);
        }, err => {
            console.error(err);
        });
    }

    const handleAddProduct = (data: any[]) => {
      for(const product of data){
        const {gtin14, name, brand_name} = product;
        setProductList([
          ...productList,
          {
            code: gtin14, 
            name, 
            brand_name, 
            image_url: 'https://via.placeholder.com/150'
          }
        ])
      }
    };

    useEffect(() => {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);
  
    const handleBarCodeScanned = ({ type, data }: BarCodeScannerResult) => {
      setScanned(true);
      fetchProductData(data);
      alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };
  
    if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }
  
    return (
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.scanner}/>
        {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    scanner: {
      width: 400, 
      height: 300,
    }
});

export default BarCode;