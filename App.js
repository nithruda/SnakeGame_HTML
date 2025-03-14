import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Levels from './Levels';
import GameScreen from './GameScreen';
import HomePage from './HomePage';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
       <Stack.Screen name="HomePage" component={HomePage} />
       // <Stack.Screen name="Levels" component={Levels} />
        <Stack.Screen name="GameScreen" component={GameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
