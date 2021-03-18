import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import {Product} from '../App';
import colors from '../constants/Colors';

interface Props {
    currentProduct: Product|null;
};

const CurrentProduct: React.FC<Props> = ({currentProduct}) => {
    if(!currentProduct) return <Text>No current product is available!</Text>;
    return (
        <View style={styles.container}>
            <Image 
                style={styles.image}
                source={{uri: currentProduct.image_url}}>    
            </Image>
            <View style={styles.text}>
                <Text style={styles.name}>{currentProduct.name}</Text>
                <Text style={styles.brand}>Manfucatured by {currentProduct.brand_name}</Text>
            </View>
        </View>
    );
};

export default CurrentProduct;

const styles = StyleSheet.create({
    container: {
        ...colors.pink,
        alignItems: 'center',
    },
    text: {
        justifyContent: 'center',
        paddingBottom: 15,
    },
    name: {
      fontSize: 30,
      fontWeight: 'bold',
    },
    brand: {
        fontSize: 15,
    },
    image: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
        paddingVertical: 150,
    }
});