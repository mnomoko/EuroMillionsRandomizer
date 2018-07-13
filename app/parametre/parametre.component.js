import React, { Component } from 'react';
import { BackHandler, Button, View } from 'react-native';
import {SQLite} from "expo";

const db = SQLite.openDatabase('db.db');

export class ParametreComponent extends Component {

    constructor(props) {
        super(props);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    render() {
        return (
            <View style={{ flex: 6, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ marginTop: 20 }}>
                    { this.renderButton(this.delete, 'Supprimer tous les tirages') }
                </View>
            </View>
        )
    }

    renderButton(fn: Function, title: String) {
        return (
            <Button
                onPress={ fn.bind(this) }
                title={ title } color="#0e4884" accessibilityLabel={ title }
            />
        )
    }

    executeSql = async (sql, params = []) => {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(sql, params, (_, { rows }) => resolve(rows._array), reject)
        }))
    };

    delete = () => {
        this.executeSql('delete from tirage', []);
        alert('Tous les tirages ont été supprimé')
    };

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', () => {});
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        if (this.props.navigation.index) {
            this.props.dispatch({type: "Navigation/BACK"});
            return true
        } else {
            return false
        }
    }
}