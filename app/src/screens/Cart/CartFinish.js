/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BasicButton from '../../components/BasicButton';
import {CartService} from '../../services/CartService';
import {DeliveryService} from '../../services/DeliveryService';
import Toast from 'react-native-toast-message';

const LineTitle = () => {
  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        height: 10,
        color: 'black',
        width: '90%',
        marginLeft: 5,
        marginRight: 5,
        borderBottomColor: 'black',
        borderBottomWidth: 3,
      }}
    />
  );
};

function CartFinishPage({navigation, route}) {
  const {cartData} = route.params;
  const [issues, setIssues] = useState([true, true, true]);
  const [shipperMessage, setShipperMessage] = useState('');
  const [litigesMessage, setLitigesMessage] = useState('');

  const [cart, setCarts] = useState([]);

  const copyToClipboard = () => {
    Clipboard.setString('hello world');
  };

  useEffect(() => {
    setCarts(cartData);
  }, [cartData, cart]);

  const finishCart = async () => {
    try {
      await CartService.finishCart(
        cart.id,
        !issues[0] && !issues[1] && !issues[2],
      );
      Toast.show({
        type: 'success',
        text1: 'Commande terminée !',
      });
      setTimeout(() => {
        navigation.navigate('AccountPage');
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainTitleView}>
        <Text style={styles.mainTitle}>Retour sur la commande</Text>
      </View>
      <View style={styles.subContainer}>
        <View style={[styles.subView, styles.subViewFirst]}>
          <View style={styles.titleView}>
            <LineTitle />
            <Text style={styles.title}>A propos des produits</Text>
            <LineTitle />
          </View>
          <BouncyCheckbox
            style={styles.checkbox}
            textStyle={{
              textDecorationLine: 'none',
            }}
            size={25}
            fillColor="green"
            unfillColor="#FFFFFF"
            text="Tous les produits étaient présents"
            iconStyle={{borderColor: 'green'}}
            innerIconStyle={{borderWidth: 2}}
            isChecked={!issues[0]}
            onPress={isChecked => setIssues([!isChecked, issues[1], issues[2]])}
          />
          <BouncyCheckbox
            style={styles.checkbox}
            textStyle={{
              textDecorationLine: 'none',
            }}
            size={25}
            fillColor="green"
            unfillColor="#FFFFFF"
            text="Tous les produits étaient en bon état"
            iconStyle={{borderColor: 'green'}}
            innerIconStyle={{borderWidth: 2}}
            isChecked={!issues[1]}
            onPress={isChecked => setIssues([issues[0], !isChecked, issues[2]])}
          />
          <BouncyCheckbox
            style={styles.checkbox}
            textStyle={{
              textDecorationLine: 'none',
            }}
            size={25}
            fillColor="green"
            unfillColor="#FFFFFF"
            text="La commande a été bien organisée"
            iconStyle={{borderColor: 'green'}}
            innerIconStyle={{borderWidth: 2}}
            isChecked={!issues[2]}
            onPress={isChecked => setIssues([issues[0], issues[1], !isChecked])}
          />
        </View>
        <View style={styles.subView}>
          <View style={styles.titleView}>
            <LineTitle />
            <Text style={styles.title}>Litiges éventuels</Text>
            <LineTitle />
          </View>
          <TextInput
            style={styles.input}
            onChangeText={() => {}}
            value={litigesMessage}
            placeholder="Eventuel litige"
            placeholderTextColor="grey"
          />
          <Pressable
            style={styles.photoPressable}
            onPress={() => navigation.navigate('CartFinishCameraPage')}>
            <Text style={styles.photoText}>Prendre une photo</Text>
            <Ionicons
              style={styles.statusItemIcon}
              name={'camera-outline'}
              size={40}
              color={'grey'}
            />
          </Pressable>
        </View>
        <View style={styles.subView}>
          <View style={styles.titleView}>
            <LineTitle />
            <Text style={styles.title}>Message au livreur</Text>
            <LineTitle />
          </View>
          <View style={styles.copyClipboardView}>
            <Text style={styles.copyClipboardText}>Téléphone :</Text>
            <TouchableOpacity
              style={styles.copyClipboardTouchable}
              onPress={() => copyToClipboard()}>
              <Ionicons
                style={styles.statusItemIcon}
                name={'copy-outline'}
                size={30}
                color={'grey'}
              />
              <Text style={styles.copyClipboardNumberText}>
                {cartData.delivery.shipper.user.phone}
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            onChangeText={() => {}}
            value={shipperMessage}
            placeholder="Message facultatif pour le livreur"
            placeholderTextColor="grey"
          />
        </View>
        <View style={[styles.subView, styles.subViewLast]}>
          <BasicButton
            style={styles.validationButton}
            onClick={() => {
              finishCart();
            }}
            text="Valider"
          />
        </View>
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    display: 'flex',
    width: '100%',
  },
  mainTitle: {
    fontSize: 30,
    textAlign: 'center',
    color: 'black',
  },
  mainTitleView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 5,
    paddingTop: 10,
  },
  titleView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoPressable: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    padding: 10,
    elevation: 10,
    borderRadius: 10,
  },
  photoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 10,
  },
  checkbox: {
    margin: 5,
  },
  subView: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subViewFirst: {
    marginTop: 0,
  },
  subViewLast: {
    marginTop: 10,
  },
  title: {
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
  },
  input: {
    height: 80,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '90%',
  },
  copyClipboardNumberText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  copyClipboardText: {
    fontSize: 20,
    color: 'black',
  },
  copyClipboardView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyClipboardTouchable: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: 'lightgrey',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
});

export default CartFinishPage;
