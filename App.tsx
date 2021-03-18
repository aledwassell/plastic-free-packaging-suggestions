import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';

import dimensions from './constants/Layout';

import BarCode from './components/BarCode';
import ProductList from './components/ProductList';
import CurrentProduct from './components/CurrentProduct';
import CustomButton from './components/CustomButton';

import {BarCodeScannerResult } from 'expo-barcode-scanner';

// RxJS.
import {of} from 'rxjs';
import {fromFetch} from 'rxjs/fetch';
import {switchMap} from 'rxjs/operators';

export type Product = {
  code: string,
  name: string,
  brand_name: string,
  image_url?: string,
};

const App = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product|null>(null);

  const fetchProductData = ({ type, data }: BarCodeScannerResult) => {
    const URL = `http://192.168.0.23:8080/api/products/${data}`;
    fromFetch(URL)
      .pipe(switchMap(resp => {
        if (resp.ok) return resp.json();
        else return of({error: true, message: `Error: ${resp.status}`});
      }))
      .subscribe(data => {
        handleAddCurrentProduct(data);
      }, err => {
          console.error(err);
      });
  }

  const handleAddCurrentProduct = (product: Product) => {
    setCurrentProduct(product);
    setProductList([
      ...productList,
      product,
    ]);
  };

  if (!currentProduct) {
    return (
      <BarCode 
        style={[StyleSheet.absoluteFillObject, styles.border]}
        fetchProductData={fetchProductData}
        currentProduct={currentProduct}/>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={productList.length ? styles.topHalf : styles.full}>
        {currentProduct && <CustomButton onPress={() => setCurrentProduct(null)} title={'Scan Again'} />}
        <CurrentProduct currentProduct={currentProduct}/>
      </View>
      <ProductList productList={productList}/>
    </ScrollView>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
  },
  topHalf: {
    height: dimensions.window.height / 2,
  },
  full: {
    height: dimensions.window.height - 30,
  },
  border: {
    borderColor: 'green',
    borderWidth: 3,
  }
});
