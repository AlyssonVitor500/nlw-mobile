import { Box } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { Signin } from '../screens/Singin';
import { AppRoutes } from './app.routes';

import { useAuth } from '../hooks/useAuth';

export function Routes() {
    const { user } = useAuth();

    return(
        <Box flex={1} bg="gray.900">
            <NavigationContainer>
                { user.name ? <AppRoutes /> : <Signin />}
            </NavigationContainer>
        </Box>
    )
}