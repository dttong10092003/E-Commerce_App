import {
    View,
    TouchableOpacity,
    Image,
    TextInput,
    Alert,
  } from 'react-native';
  import React, {useState} from 'react';
  import icons from '../constants/icons';
  import {useNavigation} from '@react-navigation/native';
  import {StackNavigationProp} from '@react-navigation/stack';
  
  type CustomSearchProps = {
    placeholder?: string;
    initialQuery: string;
  };

  type RootStackParamList = {
    Catalog: {
      mainCategory: string; 
      subCategoryName: string; 
      subSubCategory: string;
      filters?: {
        searchQuery?: string;
      };
    };
  };
  
  type ScreenNavigationProps = StackNavigationProp<RootStackParamList, 'Catalog'>;

  const CustomSearch: React.FC<CustomSearchProps> = ({
    placeholder,
    initialQuery,
  }) => {
    const navigation = useNavigation<ScreenNavigationProps>();
    
    const [query, setQuery] = useState(initialQuery);

    const handlePress = () => {
      if (query.trim() === '') {
        return Alert.alert('Please fill the required field');
      } else {
        navigation.navigate('Catalog', {
          mainCategory: 'All',
          subCategoryName: 'New',
          subSubCategory: 'All',
          filters: {
            searchQuery: query,
          },
        });
        setQuery('');
      }
    };
  
    return (
      <View className="mx-4">
        <View className="flex flex-row items-center justify-between bg-white w-full rounded-xl pr-4 h-16">
          <TouchableOpacity onPress={handlePress}>
            <Image
              source={icons.search}
              className="w-6 h-6 mx-4"
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TextInput
            placeholder={placeholder || 'Search any Product..'}
            value={query}
            onChangeText={(e: string) => setQuery(e)}
            className="text-black-500 flex-1 text-lg font-pregular bg-white"
            placeholderTextColor={'#BBBBBB'}
            onSubmitEditing={handlePress}
          />
          <Image source={icons.mic} className="w-8 h-8" resizeMode="contain" />
        </View>
      </View>
    );
  };
  
  export default CustomSearch;