import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Barcode from './components/BarCode';
import ProductList from './components/ProductList';

export type Product = {
  code: string,
  name: string,
  brand_name: string,
  image_url: string,
};

const App = () => {
  const [productList, setProductList] = useState([]);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Our Header Text.</Text>
      <Barcode productList={productList} setProductList={setProductList}/>
      <ProductList productList={productList}/>
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  titleText: {
    fontSize: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
