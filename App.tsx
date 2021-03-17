import React, {useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';

import dimensions from './constants/Layout';

import BarCode from './components/BarCode';
import ProductList from './components/ProductList';
import CurrentProduct from './components/CurrentProduct';
import CustomButton from './components/CustomButton';

export type Product = {
  code: string,
  name: string,
  brand_name: string,
  image_url?: string,
};

const App = () => {
  const [productList, setProductList] = useState([]);
  const [currentProduct, setCurrentProduct] = useState<Product|null>(null);

  return (
    <ScrollView style={styles.container}>
      <View style={productList.length ? styles.topHalf : styles.full}>
        {currentProduct ? <CurrentProduct currentProduct={currentProduct}/> : <BarCode productList={productList} setProductList={setProductList} currentProduct={currentProduct} setCurrentProduct={setCurrentProduct}/>}
        {currentProduct && <CustomButton onPress={() => setCurrentProduct(null)} title={'Scan Again'} />}
      </View>
      {/* <ProductList productList={productList}/> */}
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
  }
});
