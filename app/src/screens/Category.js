import React, {useEffect, useState} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ProductShowcase from '../components/ProductShowcase';
import {getProductsInCategory} from '../services/ProductService';

function CategoryPage({navigation, route}) {
  const {categoryId, name} = route.params;

  const [products, setProducts] = useState({});

  useEffect(() => {
    navigation.setOptions({title: name});
    getProductsInCategory(categoryId).then(data => setProducts(data));
  }, [navigation, categoryId, name]);

  const renderProductItem = ({item}) => (
    <ProductShowcase
      navigation={navigation}
      id={item.id}
      onClick={() => {
        navigation.navigate('ProductPage', {id: item.id});
      }}
    />
  );
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        numColumns={2}
        columnWrapperStyle={styles.productsColumnWrapperStyle}
        style={styles.productsFlatList}
        data={products}
        renderItem={renderProductItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productsColumnWrapperStyle: {
    flex: 1,
    justifyContent: 'space-around',
  },
  productsFlatList: {
    marginTop: 10,
    height: '100%',
  },
});

export default CategoryPage;
