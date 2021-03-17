import React from "react";
import {ScrollView, Image, View, StyleSheet, Text} from 'react-native';

import dimensions from '../constants/Layout';

import {Product} from '../App';

type Props = {
    productList: Product[]
};

const ProductList = ({productList}: Props) => {    
    return(
        <ScrollView style={styles.container}>
            {productList.map((product, key) => (
                <View key={key} style={styles.product}>
                    <Image 
                        source={{uri: product.image_url}}
                        style={styles.image}></Image>
                    <View>
                        <Text style={styles.name}>Name: {product.name}</Text>
                        <Text style={styles.brand}>Brand: {product.brand_name}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}
  
export default ProductList;

const styles = StyleSheet.create({
    container: {
        width: dimensions.window.width,
        padding: 5
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    brand: {
        fontSize: 15,
    },
    product: {
        flexDirection: 'row'
    },
    image: {
        width: 150,
        height: 150
    }
  });