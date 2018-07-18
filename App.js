import Expo from 'expo';
import React, { Component } from 'react';
import { Container, Icon } from "native-base";
import {createDrawerNavigator, createStackNavigator, DrawerNavigator, StackNavigator} from 'react-navigation';
import { AccueilComponent } from "./app/accueil/accueil.component";
import {HistoriqueComponent} from "./app/historique/historique.component";
import {ParametreComponent} from "./app/parametre/parametre.component";

const db = Expo.SQLite.openDatabase('db.db');

getNavigationOptions = (title) => {
    return {
        title: title,
        headerStyle: {
            backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    }
};

const Accueilstack = createStackNavigator({
    Home: {
        screen: AccueilComponent,
        navigationOptions: ({ navigation }) => ({
            title: 'EuroMillions Randomizer',  // Title to appear in status bar
            headerLeft: <Icon name="menu" size={35} onPress={ () => navigation.openDrawer() } />
        })
    }
});

const HistoriqueStack = createStackNavigator({
    Schedules: {
        screen: HistoriqueComponent,
        navigationOptions: ({ navigation }) => ({
            title: 'EuroMillions Randomizer',  // Title to appear in status bar
            headerLeft: <Icon name="menu" size={35} onPress={ () => navigation.openDrawer() } />
        })
    }
});

const ParametreStack = createStackNavigator({
    Parametre: {
        screen: ParametreComponent,
        navigationOptions: ({ navigation }) => ({
            title: 'EuroMillions Randomizer',  // Title to appear in status bar
            headerLeft: <Icon name="menu" size={35} onPress={ () => navigation.openDrawer() } />
        })
    }
});

const Root = createDrawerNavigator({
    Accueil: {
        screen: Accueilstack,
        navigationOptions: {
            title: 'Accueil' // Text shown in left menu
        }
    },
    Historique: {
        screen: HistoriqueStack,
        navigationOptions: {
            title: 'Historiques',  // Text shown in left menu
        }
    },
    Parametre: {
        screen: ParametreStack,
        navigationOptions: {
            title: 'Paramètres',  // Text shown in left menu
        }
    }
});

export default class App extends Component {

    state = {
        isReady: false,
    };

    constructor(props) {
        super(props);
    }

    async componentWillMount() {
        await Expo.Font.loadAsync({
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
            Ionicons: require("native-base/Fonts/Ionicons.ttf")
        });
        this.setState({ isReady: true });
    }

    componentDidMount() {
        db.transaction(tx => {
            tx.executeSql(
                'create table if not exists tirage (id text primary key not null, c1 int, c2 int, c3 int, c4 int, c5 int, e1 int, e2 int);'
            );
        });
    }

    render() {
        return (
            this.state.isReady ?
            <Container>
                <Root/>
            </Container>
                : null
        )
    }
}
