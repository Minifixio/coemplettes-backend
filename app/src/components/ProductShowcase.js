import React, {useState, useContext, useEffect} from 'react';
import {Text, Pressable, StyleSheet, View, Image} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InputSpinner from 'react-native-input-spinner';

import {CartContext} from '../utils/CartProvider';

const bioIcon = require('../assets/icons/misc/bio.png');

const ProductShowcase = ({navigation, id, productData}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [product, setProduct] = useState({});
  const {addToCart, removeFromCart} = useContext(CartContext);

  useEffect(() => {
    navigation.setOptions({title: ''});
    setProduct(productData);
    // A chaque fois que la page se load, on reset les compteurs des produits
    const unsubscribe = navigation.addListener('focus', () => {
      setQuantity(0);
      setIsSelected(false);
    });
    return unsubscribe;
  }, [id, navigation, productData]);

  function onClick() {
    navigation.navigate('ProductPage', {id, productData});
  }

  const pressableCliked = () => {
    if (isSelected) {
      console.log(quantity);
    } else {
      setIsSelected(true);
    }
  };

  const inputChanged = val => {
    console.log(`[ProductShowcase] Added one ${product.name} to the cart`);
    const valTemp = val;
    setQuantity(val);
    if (val === 0) {
      setIsSelected(false);
      removeFromCart(id);
      return;
    } else {
      if (valTemp > quantity) {
        addToCart(product, 1);
      } else {
        addToCart(product, -1);
      }
    }
  };

  return (
    <LinearGradient colors={['#ffffff', '#e6e6e6']} style={styles.container}>
      {productData.is_bio && (
        <View style={styles.bioLabelContainer}>
          <Image style={styles.bioIcon} source={bioIcon} />
        </View>
      )}
      <View style={styles.productContainer}>
        <Pressable style={styles.pressableProduct} onPress={onClick}>
          <Image style={styles.image} source={{uri: product.icon_link}} />
          <Text style={styles.priceText}>
            {product.average_price}€ / {product.quantity_type}
          </Text>

          <Text style={styles.titleText}>{product.name}</Text>
        </Pressable>

        <Pressable style={styles.addPressable} onPress={pressableCliked}>
          {/* Si le produit n'est séléctionné on montre le boutton "Add to basket" */}
          {!isSelected && (
            <View style={styles.pressableView}>
              <Ionicons
                style={styles.addBasketIcon}
                name="basket"
                size={25}
                color="black"
              />
              {/* <Image style={styles.icon} source={addBasketIcon} /> */}
              <Text style={styles.addText}>Ajouter au panier</Text>
            </View>
          )}
          {/* Sinon on montre l'input pour choisir la quantité */}
          {isSelected && (
            <View style={styles.inputSpinnerView}>
              <InputSpinner
                style={styles.inputSpinner}
                skin="square"
                colorLeft="#539903"
                colorRight="#539903"
                height={40}
                max={100}
                min={0}
                step={1}
                colorMax={'#f04048'}
                colorMin={'#40c5f4'}
                value={quantity}
                onChange={num => {
                  inputChanged(num);
                }}
              />
            </View>
          )}
        </Pressable>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  container: {
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    backgroundColor: '#e6e6e6',
    borderRadius: 10,
  },
  pressableProduct: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 80,
  },
  pressableView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPressable: {
    borderColor: 'black',
    borderTopWidth: 2,
    marginTop: 5,
    width: '100%',
    height: 40,
    display: 'flex',
    justifyContent: 'center',
  },
  addText: {
    fontSize: 14,
    textAlign: 'center',
    color: 'grey',
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
    color: 'green',
  },
  addBasketIcon: {
    marginRight: 5,
  },
  inputSpinnerView: {
    height: 40,
    display: 'flex',
  },
  bioLabelContainer: {
    display: 'flex',
    width: 35,
    height: 35,
    top: -5,
    right: -5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 20,
  },
  bioIcon: {
    width: 35,
    height: 35,
  },
});

export default ProductShowcase;
