import React, { Component } from 'react';
import {BackHandler, Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';

import { Tirage } from "../commons/tirage";
import {SQLite} from "expo";

import 'prop-types';

const db = SQLite.openDatabase('db.db');

export class HistoriqueComponent extends Component {

    /* static navigationOptions = {
        title: 'Historique',
    }; */

    state = {
        tirages: []
    };

    executeSql = async (sql, params = []) => {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(sql, params, (_, { rows }) => resolve(rows._array), reject)
        }))
    };

    init = async() => {
        await this.select();
    };

    select = () => {
        this.executeSql('select * from tirage', []).then(result => {
            let tirages :Tirage[] = [];
            for(let t of result) {
                let tirage: Tirage = new Tirage();
                tirage.chiffres[0] = t['c1'];
                tirage.chiffres[1] = t['c2'];
                tirage.chiffres[2] = t['c3'];
                tirage.chiffres[3] = t['c4'];
                tirage.chiffres[4] = t['c5'];
                tirage.etoiles[0] = t['e1'];
                tirage.etoiles[1] = t['e2'];

                tirages.push(tirage);
            }
            this.setState({tirages: tirages});
            this.setState({isLoaded: true});
        });
    };

    constructor(props) {
        super(props);
        this.init();
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }

    renderSeparator = () => {
        return (<View style={ styles.separator }/>);
    };

    _renderItem = ({item: tirage}) => (
        <View style={{ flexDirection:"row", justifyContent: 'center', marginTop: 20 }}>
            <Text style={ styles.numberCircle }> { tirage.chiffres[0] }</Text>
            <Text style={ styles.numberCircle }> { tirage.chiffres[1] }</Text>
            <Text style={ styles.numberCircle }> { tirage.chiffres[2] }</Text>
            <Text style={ styles.numberCircle }> { tirage.chiffres[3] }</Text>
            <Text style={ styles.numberCircle }> { tirage.chiffres[4] }</Text>
            <Text style={ styles.numberSquare }> { tirage.etoiles[0] }</Text>
            <Text style={ styles.numberSquare }> { tirage.etoiles[1] }</Text>
        </View>

    );

    render() {
        const { tirages } = this.state;
        return (
            <View>
                <FlatList
                    data={ tirages }
                    style={{ flexGrow: 1}}
                    renderItem={this._renderItem.bind(this)}
                    keyExtractor={item => item.id}
                    ItemSeparatorComponent={this.renderSeparator}
                    contentContainerStyle={{paddingBottom:30}}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    /*
     * Removed for brevity
     */
    separator: {
        marginTop: 20,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
    },
    numberCircle: {
        borderRadius: 50,
        width: 36,
        height: 36,
        padding: 9,
        borderWidth: 2,
        borderStyle: 'solid',
        color: '#666666',
        textAlign: 'center',
        margin: 2
    },
    numberSquare: {
        borderRadius: 0,
        width: 36,
        height: 36,
        padding: 9,
        borderWidth: 2,
        borderStyle: 'solid',
        color: '#666666',
        textAlign: 'center',
        margin: 2
    },
});