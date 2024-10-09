import {View, Text} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';

type Props = {};
type RootStackParamList = {
  Search: {query: string} | undefined;
};

type ScreenRouteProps = RouteProp<RootStackParamList, 'Search'>;
interface SearchProps {
  route: ScreenRouteProps;
}

const SearchTab: React.FC<SearchProps> = ({route}) => {
  const {query} = route.params || {};

  return (
    <SafeAreaView>
      <Text>SearchTab</Text>
      <Text>Query: {query}</Text>
    </SafeAreaView>
  );
};

export default SearchTab;
