import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MagnifyingGlassIcon, XMarkIcon, Bars3CenterLeftIcon } from 'react-native-heroicons/outline';
import { CalendarDaysIcon, MapPinIcon } from 'react-native-heroicons/solid';
import { debounce } from "lodash";
import { theme } from '../theme';
import { fetchLocations, fetchWeatherForecast } from '../api/weather';
import * as Progress from 'react-native-progress';
import { StatusBar } from 'expo-status-bar';
import { weatherImages } from '../constants';
import { getData, storeData } from '../utils/asyncStorage';
import PopupMenu from './PopupMenu'; // Import PopupMenu
import checkAndSendNotifications from './alert'; // Import the function to check and send notifications

export default function HomeScreen({ navigation }) {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState({});
  const [searchFocused, setSearchFocused] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false); // State to manage the visibility of the popup menu

  const handleSearch = search=>{
    if(search && search.length>2)
      fetchLocations({cityName: search}).then(data=>{
        setLocations(data);
      })
  }

  const handleLocation = loc=>{
    setLoading(true);
    toggleSearch(false);
    setLocations([]);
    fetchWeatherForecast({
      cityName: loc.name,
      days: '7'
    }).then(data=>{
      setLoading(false);
      setWeather(data);
      storeData('city',loc.name);
      // Call function to check and send notifications
      checkAndSendNotifications(data);
    })
  }

  useEffect(()=>{
    fetchMyWeatherData();
  },[]);

  const fetchMyWeatherData = async ()=>{
    let myCity = await getData('city');
    let cityName = 'Islamabad';
    if(myCity){
      cityName = myCity;
    }
    fetchWeatherForecast({
      cityName,
      days: '7'
    }).then(data=>{
      setWeather(data);
      setLoading(false);
      // Call function to check and send notifications
      checkAndSendNotifications(data);
    })
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const {location, current} = weather;

  const handleNotificationPress = () => {
    // Navigate to the NotificationsScreen and hide the popup menu
    navigation.navigate('Notifications');
    setMenuVisible(false);
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <StatusBar style="light" />
      <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', top: 20, left: 20, zIndex: 70 }}>
        {/* Render the Bars3CenterLeftIcon */}
        <TouchableOpacity 
          onPress={() => setMenuVisible(true)} // Toggle the visibility of the popup menu
          style={{ padding: 40, marginLeft : -30 }}>
          <Bars3CenterLeftIcon size="35" color="white" />
        </TouchableOpacity>
        {/* Render the popup menu */}
        <PopupMenu 
          visible={menuVisible} 
          onClose={() => setMenuVisible(false)} 
          onNotificationPress={handleNotificationPress} // Pass the function to handle notification press
          onReportIssuePress={() => {}}
          onUnitsPress={() => {}}
        />
      </View>
      <Image 
        blurRadius={70} 
        source={require('../assets/images/bg.png')} 
        style={{ position: 'absolute', width: '100%', height: '100%' }} />
        {
          loading? (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
            </View>
          ) : (
            <SafeAreaView style={{ flex: 1 }}>
              {/* search section */}
              <View style={{ height: '7%', marginHorizontal: 20, position: 'relative', zIndex: 50 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', borderRadius: 20, backgroundColor: showSearch ? 'rgba(255, 255, 255, 0.2)' : 'transparent' }}>
                  {showSearch ? (
                    <TextInput 
                      onFocus={() => {
                        setSearchFocused(true);
                        toggleSearch(true);
                      }}
                      onBlur={() => setSearchFocused(false)}
                      onChangeText={handleTextDebounce} 
                      placeholder="Search city" 
                      placeholderTextColor={'lightgray'} 
                      style={{ paddingLeft: 10, height: 40, flex: 1, fontSize: 16, color: 'white' }} 
                    />
                  ) : null}
                  <TouchableOpacity 
                    onPress={()=> {
                      setSearchFocused(false);
                      toggleSearch(!showSearch);
                    }}
                    style={{ borderRadius: 20, padding: 10, margin: 5, backgroundColor: theme.bgWhite(0.3) }}>
                    {showSearch ? (
                      <XMarkIcon size="25" color="white" />
                    ) : (
                      <MagnifyingGlassIcon size="25" color="white" />
                    )}
                  </TouchableOpacity>
                </View>
                {/* Render the locations dropdown */}
                {locations.length > 0 && showSearch ? (
                  <View style={{ position: 'absolute', width: '100%', backgroundColor: '#ddd', top: '100%', borderRadius: 20 }}>
                    {locations.map((loc, index) => (
                      <TouchableOpacity 
                        key={index}
                        onPress={()=> handleLocation(loc)} 
                        style={{ flexDirection: 'row', alignItems: 'center', padding: 10, marginBottom: index + 1 !== locations.length ? 1 : 0 }}>
                          <MapPinIcon size="20" color="gray" />
                          <Text style={{ marginLeft: 10, color: 'black', fontSize: 16 }}>{loc?.name}, {loc?.country}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}
              </View>

              {/* forecast section */}
              <View className="mx-4 flex justify-around flex-1 mb-2">
                {/* location */}
                <Text className="text-white text-center text-2xl font-bold">
                  {location?.name}, 
                  <Text className="text-lg font-semibold text-gray-300">{location?.country}</Text>
                </Text>
                {/* weather icon */}
                <View className="flex-row justify-center">
                  <Image 
                    source={weatherImages[current?.condition?.text || 'other']} 
                    className="w-52 h-52" />
                  
                </View>
                {/* degree celcius */}
                <View className="space-y-2">
                    <Text className="text-center font-bold text-white text-6xl ml-5">
                      {current?.temp_c}&#176;
                    </Text>
                    <Text className="text-center text-white text-xl tracking-widest">
                      {current?.condition?.text}
                    </Text>
                </View>

                {/* other stats */}
                <View className="flex-row justify-between mx-4">
                  <View className="flex-row space-x-2 items-center">
                    <Image source={require('../assets/icons/wind.png')} className="w-6 h-6" />
                    <Text className="text-white font-semibold text-base">{current?.wind_kph}km</Text>
                  </View>
                  <View className="flex-row space-x-2 items-center">
                    <Image source={require('../assets/icons/drop.png')} className="w-6 h-6" />
                    <Text className="text-white font-semibold text-base">{current?.humidity}%</Text>
                  </View>
                  <View className="flex-row space-x-2 items-center">
                    <Image source={require('../assets/icons/sun.png')} className="w-6 h-6" />
                    <Text className="text-white font-semibold text-base">
                      { weather?.forecast?.forecastday[0]?.astro?.sunset }
                    </Text>
                  </View>
                  
                </View>
              </View>

              {/* forecast for next days */}
              <View className="mb-2 space-y-3">
                <View className="flex-row items-center mx-5 space-x-2">
                  <CalendarDaysIcon size="22" color="white" />
                  <Text className="text-white text-base">Prévisions sur 7 jours</Text>
                </View>
                <ScrollView   
                  horizontal
                  contentContainerStyle={{paddingHorizontal: 15}}
                  showsHorizontalScrollIndicator={false}
                >
                  {
                    weather?.forecast?.forecastday?.map((item,index)=>{
                      const date = new Date(item.date);
                      const options = { weekday: 'long' };
                      let dayName = date.toLocaleDateString('fr-FR', options);
                      dayName = dayName.split(',')[0];

                      return (
                        <View 
                          key={index} 
                          className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4" 
                          style={{backgroundColor: theme.bgWhite(0.15)}}
                        >
                          <Image 
                            source={weatherImages[item?.day?.condition?.text || 'other']}
                              className="w-11 h-11" />
                          <Text className="text-white">{dayName}</Text>
                          <Text className="text-white text-xl font-semibold">
                            {item?.day?.avgtemp_c}&#176;
                          </Text>
                        </View>
                      )
                    })
                  }
                  
                </ScrollView>
              </View>
            </SafeAreaView>
          )
        }
      
    </View>
  )
}
