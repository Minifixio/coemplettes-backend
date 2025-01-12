import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {CartProvider} from '../../utils/CartProvider';

import HomeStack from './Home';
import FavoutritesPage from './Favourites';
import CartPage from '../Cart/Cart';
import AccountStack from './Account';
import ShipperAccountStack from '../Shipper/ShipperAccount';

// const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainPage({isConnected, setIsConnected}) {
  return (
    <CartProvider>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'md-home' : 'md-home-outline';
            } else if (route.name === 'Account') {
              iconName = focused ? 'person-circle' : 'person-circle-outline';
            } else if (route.name === 'FavoutritesPage') {
              iconName = focused ? 'star' : 'star-outline';
            } else if (route.name === 'ShipperAccountStack') {
              iconName = focused ? 'ios-receipt' : 'ios-receipt-outline';
            } else if (route.name === 'CartPage') {
              iconName = focused ? 'basket' : 'basket-outline';
              size = 35;
              color = 'white';
            }

            if (route.name === 'CartPage') {
              return (
                <View style={styles.cartTabItem}>
                  <Ionicons name={iconName} size={size} color={color} />
                </View>
              );
            } else {
              return <Ionicons name={iconName} size={size} color={color} />;
            }
          },
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: 'grey',
        })}>
        <Tab.Screen name="Home" options={{headerShown: false}}>
          {props => (
            <HomeStack
              isConnected={isConnected}
              setIsConnected={setIsConnected}
              {...props}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Account"
          component={AccountStack}
          options={{title: 'Compte', headerShown: false}}
        />
        <Tab.Screen
          name="ShipperAccountStack"
          options={{title: 'Livraisons', headerShown: false}}
          component={ShipperAccountStack}
        />
        {/* <Tab.Screen
          name="FavoutritesPage"
          component={FavoutritesPage}
          options={{title: 'Favorits'}}
        /> */}
        <Tab.Screen
          name="CartPage"
          component={CartPage}
          options={{title: ''}}
        />
      </Tab.Navigator>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  cartTabItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    borderRadius: 50,
    width: 70,
    height: 70,
    marginBottom: 20,
    marginRight: 10,
  },
});

export default MainPage;
