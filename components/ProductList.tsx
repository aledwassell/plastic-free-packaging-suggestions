import React from "react";
import {Image, View, StyleSheet, Text} from 'react-native';

import dimensions from '../constants/Layout';

import {Product} from '../App';

type Props = {
    productList: Product[]
};

const ProductList = ({productList}: Props) => {    
    return(
        <View style={styles.container}>
            {productList.map((product, key) => (
                <View key={key} style={styles.product}>
                    <Image 
                        source={{uri: product.image_url}}
                        style={styles.image}></Image>
                    <View style={styles.productText}>
                        <Text style={styles.name}>Name: {product.name}</Text>
                        <Text style={styles.brand}>Brand: {product.brand_name}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}
  
export default ProductList;

const styles = StyleSheet.create({
    container: {
        width: dimensions.window.width,
        padding: 5
    },
    product: {
        flexDirection: 'row'
    },
    image: {
        width: 150,
        height: 150
    },
    productText: {
        justifyContent: 'center',
        padding: 5,
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    brand: {
        fontSize: 15,
    },
  });

  