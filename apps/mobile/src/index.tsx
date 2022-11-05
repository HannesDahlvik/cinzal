import Providers from './Providers'
import { StatusBar } from 'expo-status-bar'
import App from './App'

const Index: React.FC = () => {
    return (
        <Providers>
            <StatusBar style="light" />
            <App />
        </Providers>
    )
}

export default Index
