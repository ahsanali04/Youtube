import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import React, {FunctionComponent, useEffect, useState} from 'react';
import Loader from '../common/Loader';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import axios from 'axios';

const Notifications: FunctionComponent = ({route, navigation}) => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchCategories();
    fetchData();
  }, []);

  const fetchCategories = async () => {
    setLoader(true);
    try {
      const options = {
        method: 'GET',
        url: 'https://api.kinocheck.com/trailers',
        id: '4ghv',
        youtube_video_id: 'EJJedP2_7_k',
        youtube_channel_id: 'UCOL10n-as9dXO2qtjjFUQbQ',
        youtube_thumbnail:
          'https://img.youtube.com/vi/EJJedP2_7_k/maxresdefault.jpg',
        title: 'AVENGERS 4: Endgame Trailer German Deutsch (2019)',
        thumbnail: 'https://images.kinocheck.de/images/hsd2ascncd.jpg',
        language: 'de',
        categories: ['Trailer'],
        published: '2018-12-07T13:16:51+01:00',
        views: '1391790',
      };

      try {
        const res = await axios.request(options);
        const response = Object.values(res.data);
        const allCategories = response
          .map(item => item.genres)
          .flat()
          .filter(Boolean);
        const uniqueCategories = [...new Set(allCategories)];
        console.log(uniqueCategories);
        setCategories(uniqueCategories);
        setLoader(false);
      } catch (error) {
        console.error(error);
      }
    } catch (e) {
      console.log(e);
      setLoader(false);
    }
  };

  const fetchData = async () => {
    setSelectedCategory('All');
    setLoader(true);
    try {
      const options = {
        method: 'GET',
        url: 'https://api.kinocheck.com/trailers',
        id: '4ghv',
        youtube_video_id: 'EJJedP2_7_k',
        youtube_channel_id: 'UCOL10n-as9dXO2qtjjFUQbQ',
        youtube_thumbnail:
          'https://img.youtube.com/vi/EJJedP2_7_k/maxresdefault.jpg',
        title: 'AVENGERS 4: Endgame Trailer German Deutsch (2019)',
        thumbnail: 'https://images.kinocheck.de/images/hsd2ascncd.jpg',
        language: 'de',
        categories: ['Trailer'],
        published: '2018-12-07T13:16:51+01:00',
        views: '1391790',
      };

      try {
        const res = await axios.request(options);
        const response = Object.values(res.data);
        console.log(response.length);
        console.log('response', response);
        setData(response);
        setLoader(false);
      } catch (error) {
        console.error(error);
      }
      // const res = await fetch('https://fakestoreapi.com/products');
      // const response: Product[] = await res.json();
    } catch (e) {
      console.log(e);
      setLoader(false);
    }
  };

  const filter = async item => {
    console.log('item', item);
    setSelectedCategory(item); // Set selected category
    setLoader(true);
    try {
      const options = {
        method: 'GET',
        url: 'https://api.kinocheck.com/trailers',
        id: '4ghv',
        youtube_video_id: 'EJJedP2_7_k',
        youtube_channel_id: 'UCOL10n-as9dXO2qtjjFUQbQ',
        youtube_thumbnail:
          'https://img.youtube.com/vi/EJJedP2_7_k/maxresdefault.jpg',
        title: 'AVENGERS 4: Endgame Trailer German Deutsch (2019)',
        thumbnail: 'https://images.kinocheck.de/images/hsd2ascncd.jpg',
        language: 'de',
        categories: ['Trailer'],
        published: '2018-12-07T13:16:51+01:00',
        views: '1391790',
      };

      try {
        const res = await axios.request(options);
        const response = Object.values(res.data);
        const resp = response.filter(product =>
          product?.genres?.includes(item),
        );
        setData(resp);
        setLoader(false);
      } catch (error) {
        console.error(error);
      }
      // const res = await fetch('https://fakestoreapi.com/products');
      // const response: Product[] = await res.json();
    } catch (e) {
      console.log(e);
      setLoader(false);
    }
  };

  const searchResult = text => {
    setSearch(text);
    console.log('text', text);
    // Extract titles
    const filteredProducts = data.filter(product =>
      product?.title?.toLowerCase().includes(text.toLowerCase()),
    );
    setData(filteredProducts);
  };

  function isProductInCart(productId: number) {
    return cart.filter(product => product.id === productId).length > 0;
  }

  const addToCart = item => {
    console.log('item', item.id);
    const result = isProductInCart(item.id);
    console.log(' isProductInCart(item.id)', isProductInCart(item.id));
    const res = cart.filter(data => data.id !== item.id);
    console.log('!!res', res);
    if (result) {
      // If the product is already in the cart, increment the quantity
      const updatedCart = cart.map(cartItem =>
        cartItem.id === item.id
          ? {...cartItem, quantity: cartItem.quantity + 1}
          : cartItem,
      );
      dispatch(updateCart(updatedCart));
    } else {
      // If the product is not in the cart, add it with a quantity of 1
      const updatedItem = {...item, quantity: 1};
      dispatch(updateCart([...cart, updatedItem]));
    }
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.container}>
      <Loader showModal={loader} LoaderColor={'black'} LoaderSize={'large'} />
      {/* <Header name="Shopping" /> */}
      {loader ? (
        <View>
          <View
            style={{
              backgroundColor: '#fff',
              height: 55,
              borderRadius: 10,
              marginHorizontal: 16,
              marginTop: responsiveHeight(2),
            }}></View>
          <FlatList
            data={[1, 1, 1, 1]}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={item => (
              <View
                style={{
                  marginVertical: responsiveHeight(2),
                  height: responsiveHeight(6),
                  width: responsiveWidth(20),
                  backgroundColor: '#fff',
                  marginHorizontal: responsiveWidth(4),
                  borderRadius: responsiveWidth(4),
                }}></View>
            )}
          />
          <FlatList
            data={[1, 1, 1, 1]}
            numColumns={2}
            renderItem={item => (
              <View
                style={{
                  marginTop: 10,
                  justifyContent: 'center',
                  flexDirection: 'row',
                  height: responsiveHeight(33),
                  borderRadius: 5,
                  backgroundColor: '#fff',
                  padding: 10,
                  width: responsiveWidth(45),
                  marginHorizontal: responsiveWidth(4),
                }}></View>
            )}
          />
        </View>
      ) : (
        <View style={styles.View}>
          <View style={styles.subView}>
            <TextInput
              placeholder="Search"
              style={styles.textInput}
              value={search}
              onChangeText={text => setSearch(text)}
            />
          </View>
          <Text style={styles.category1}>Categories</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              onPress={() => fetchData()}
              style={styles.listView}>
              <Text style={styles.textColor}>All</Text>
            </TouchableOpacity>
            {categories.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => filter(item)}
                style={[
                  styles.listView,
                  item === selectedCategory && styles.selectedCategory,
                ]}>
                <Text
                  style={[
                    styles.textColor,
                    item === selectedCategory && styles.selectedText,
                  ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}>
            <View style={styles.mapView}>
              {data
                ?.filter(movie =>
                  movie?.title?.toLowerCase().includes(search.toLowerCase()),
                )
                .map(item => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Watch', {item})}
                    key={item?.id}>
                    <View style={styles.FlatListView}>
                      <Image
                        source={{
                          uri: item?.youtube_thumbnail
                            ? item?.youtube_thumbnail
                            : item?.thumbnail,
                        }}
                        style={styles.image}
                        resizeMode={'stretch'}
                      />
                      <View style={styles.textView}>
                        <Text style={styles.text}>
                          {item?.title?.length > 38
                            ? item?.title.substring(0, 38) + '...'
                            : item?.title}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 20,
    backgroundColor: '#000',
  },
  FlatListView: {
    marginTop: 10,
    justifyContent: 'center',
    height: responsiveHeight(30),
    borderRadius: 5,

    padding: 10,
    width: responsiveWidth(45),
    marginBottom: responsiveHeight(1),
  },
  text: {
    marginTop: 1,
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    height: 132,
    width: 155,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 5,
  },
  textView: {
    marginTop: 3,
    marginHorizontal: 5,
  },
  mainView: {
    marginHorizontal: 5,
    alignSelf: 'center',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // display: 'flex',
  },
  textInput: {
    backgroundColor: '#fff',
    height: 55,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  View: {
    marginHorizontal: responsiveWidth(4),
    flex: 1,
  },
  subView: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
  },
  listView: {
    marginTop: 10,
    height: 40,
    backgroundColor: '#000',
    marginHorizontal: 4,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: responsiveHeight(3),
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  category: {
    fontWeight: '800',
  },
  flat: {
    marginBottom: 1,
  },
  scrollView: {
    // marginBottom: responsiveHeight(3),
    // flexDirection:'row',
  },
  selectedCategory: {
    backgroundColor: '#fff',
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#000',
  },
  mapView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    display: 'flex',
    justifyContent: 'space-between',
  },
  textColor: {
    color: '#fff',
  },
  priceView: {
    marginHorizontal: 5,
    marginTop: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartIcon: {
    fontSize: responsiveFontSize(3.4),
  },
  cartIcon1: {
    fontSize: responsiveFontSize(3.8),
  },
  count: {
    height: responsiveHeight(4),
    width: responsiveWidth(4),
    borderRadius: responsiveWidth(2),
    backgroundColor: '#000',
  },
  badgeContainer: {
    bottom: responsiveHeight(3),
    left: responsiveWidth(3.8),
    borderRadius: 50,
    position: 'absolute',
    aspectRatio: 1,
    height: responsiveHeight(3),
    backgroundColor: 'rgb(243,97,5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: responsiveWidth(3), // Adjust according to your preference
  },
  opacity: {
    marginRight: responsiveWidth(5),
    // position:'relative',
    marginTop: responsiveHeight(3),
    alignSelf: 'flex-end',
  },
  category1: {
    fontSize: responsiveFontSize(3),
    marginTop: responsiveHeight(2),
    color: '#fff',
    fontWeight: 'bold',
  },
});
