import React, { Component } from 'react';
import { BackHandler, ListView, StyleSheet, Text, View } from 'react-native';

import { Tirage } from "../commons/tirage";
import {SQLite} from "expo";

import 'prop-types';

const db = SQLite.openDatabase('db.db');

export class HistoriqueComponent extends Component {

    state = {
        dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    };

    executeSql = async (sql, params = []) => {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(sql, params, (_, { rows }) => resolve(rows._array), reject)
        }))
    };

    init = async() => {
        await this.select();
    };

    deleteTirage = (tirage) => {

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
            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            this.setState({dataSource: ds.cloneWithRows(tirages)});
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

    static navigationOptions = {
        title: 'Historique',
    };

    _renderRow(tirage) {

        return (
            <View style={{ flexDirection:"row", justifyContent: 'center', marginTop: 20 }}>
                <Text style={ styles.numberCircle }> { tirage.chiffres[0] }</Text>
                <Text style={ styles.numberCircle }> { tirage.chiffres[1] }</Text>
                <Text style={ styles.numberCircle }> { tirage.chiffres[2] }</Text>
                <Text style={ styles.numberCircle }> { tirage.chiffres[3] }</Text>
                <Text style={ styles.numberCircle }> { tirage.chiffres[4] }</Text>
                <Text style={ styles.numberSquare }> { tirage.etoiles[0] }</Text>
                <Text style={ styles.numberSquare }> { tirage.etoiles[1] }</Text>
            </View>
        )
    }

    render() {
        return (
            <View>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text> Liste </Text>
                </View>
                <ListView
                    dataSource={this.state.dataSource }
                    renderRow={this._renderRow.bind(this)}
                    renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    /*
     * Removed for brevity
     */
    separator: {
        flex: 1,
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
    }
});