import React, {Component, useEffect, useState} from "react";
import {Text, View, StyleSheet, Button} from 'react-native';

// Expo tools.
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner';

// RxJS.
import {of} from 'rxjs';
import {fromFetch} from 'rxjs/fetch';
import {switchMap} from 'rxjs/operators';
import { Product } from "../App";

type Props = {
  productList: string[],
  setProductList: any,
  currentProduct: Product,
  setCurrentProduct: any,
};

const dummyProducts = [
  {
    code: '5000169372562',
    name: 'Multi Vitimins & Iron',
    brand_name: 'Waitrose',
    image_url: 'https://ecom-su-static-prod.wtrecom.com/images/products/11/LN_735954_BP_11.jpg',
  },
  {
    code: '5045092851500',
    name: 'Vitamin B Complex',
    brand_name: 'Boots',
    image_url: 'https://boots.scene7.com/is/image/Boots/10114243?id=-Klmv1&fmt=jpg&fit=constrain,1&wid=504&hei=548',
  },
  {
    code: '5028197943448',
    name: 'Hemp Hand Cream',
    brand_name: 'The Body Shop',
    image_url: 'https://media.thebodyshop.com/i/thebodyshop/HEMP_HARD-WORKING_HAND_PROTECTOR_100ML_1_INRSDPS067.jpg?$product-zoom$',
  },
  {
    code: '02093482',
    name: 'Tape Measure',
    brand_name: 'Wilko',
    image_url: 'https://www.wilko.com/assets/bWFzdGVyfGltYWdlc3w5NjU5N3xpbWFnZS9qcGVnfGltYWdlcy9oYzEvaGRmLzg4MjMzNTI4NTI1MTAuanBnfDNhMmEwODgxYjc4ZGFjNGQ3NTg2MzUwN2NmMjlmYjEyYTFkNzFjYTlkZGRkMjVkMWViNDNjMTAxZjNjMGE3Mzk=/0209348-1.jpg',
  }
];

const API_URL = 'https://www.gtinsearch.org/api/items'

const BarCode = ({productList, setProductList, currentProduct, setCurrentProduct}: Props) => {
    const [hasPermission, setHasPermission] = useState<boolean|null>(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);
  
    if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }

    const handleBarCodeScanned = ({ type, data }: BarCodeScannerResult) => {
      fetchProductData(data);
    };
  
    const fetchProductData = (EAN: string) => {
      const product = dummyProducts.find(p => p.code === EAN); // Using fake data for now.
      if(!product) return;
      handleAddCurrentProduct(product);
      // const URL = `${API_URL}/${EAN}`;
      // fromFetch(URL)
      //   .pipe(switchMap(resp => {
      //       if (resp.ok) return resp.json()
      //       else return of({error: true, message: `Error: ${resp.status}`})
      //   }))
      //   .subscribe(data => {
      //     handleAddCurrentProduct(data);
      //   }, err => {
      //       console.error(err);
      //   });
    }

    const handleAddCurrentProduct = (product: Product) => {
      console.log(product);
      setCurrentProduct(product);
      // setProductList([
      //   ...productList,
      //   product,
      // ]);
    };

    return (
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={currentProduct ? undefined : handleBarCodeScanned}
          style={styles.scanner}/>
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