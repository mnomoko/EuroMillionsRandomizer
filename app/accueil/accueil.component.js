import React, { Component } from 'react';
import { BackHandler, Button, StyleSheet, Text, View } from 'react-native';
import {Tirage} from "../commons/tirage";
import {SQLite} from "expo";
import Utils from "./../commons/utils";

const db = SQLite.openDatabase('db.db');

export class AccueilComponent extends Component {

    static CHIFFRES = 'chiffres';
    static ETOILES = 'etoiles';

    static LIMITE_CHIFFRE = 50;
    static LIMITE_ETOILE = 12;

    static VIEW_LIST_HISTORIKS = 'ListTirage';

    constructor(props) {
        super(props);

        let tirage: Tirage = new Tirage();
        this.state = {
            tirage: tirage,
            isGenerate: false
        };

        this.numbersToPick = Utils.getArrayOfNumbers();
        this.starsToPick = Utils.getArrayOfStars();

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    executeSql = async (sql, params = []) => {
        return new Promise((resolve, reject) => db.transaction(tx => {
            tx.executeSql(sql, params, (_, { rows }) => resolve(rows._array), reject)
        }))
    };

    insert = async (tirage: Tirage) => {
        let id = Utils.generateID();
        await this.executeSql('insert into tirage (id, c1, c2, c3, c4, c5, e1, e2) values (?, ?, ?, ?, ?, ?, ?, ?)', [id, tirage.chiffres[0], tirage.chiffres[1], tirage.chiffres[2], tirage.chiffres[3], tirage.chiffres[4], tirage.etoiles[0], tirage.etoiles[1], ]);
    };

    insertGeneratedTirage = () => {
        if(this.state.isGenerate) {
            this.insert(this.state.tirage);
            this.setState({isGenerate: false});
        }
    };

    // noinspection JSAnnotator
    randomTirage = (): void => {

        let tirage: Tirage = new Tirage();

        for(let i = 0; i < 5; i++) {
            let chiffre = this.retrieveNumber(tirage, AccueilComponent.CHIFFRES, this.randomNumbers, AccueilComponent.LIMITE_CHIFFRE);
            tirage.chiffres.push(chiffre);
        }
        for(let i = 0; i < 2; i++) {
            let etoile = this.retrieveNumber(tirage, AccueilComponent.ETOILES, this.randomStars, AccueilComponent.LIMITE_ETOILE);
            tirage.etoiles.push(etoile);
        }

        this.setState({tirage: tirage, isGenerate: true});
    };

    randomStars = (): Number => {
        let limit = this.starsToPick.length;
        let number = Math.floor(Math.random() * limit);
        return this.starsToPick[number];
    };

    randomNumbers = () : Number => {
        let limit = this.numbersToPick.length;
        let number = Math.floor(Math.random() * limit);
        return this.numbersToPick[number];
    };

    retrieveNumber(tirage: Tirage, field: String, fn: Function, limit: Number): Number {
        let number: Number;
        do {
            number = fn(limit);
        }
        while(tirage[field].indexOf(number) !== -1);

        return number;
    }

    renderButtonGenerate = (fn: Function, title: String, conditional: Boolean) => {
        if(conditional) {
            return (
                <Button
                    onPress={fn}
                    title={title} color="#0e4884" accessibilityLabel={title}
                />
            )
        }
    };

    render() {
        return (
            <View style={{ flex: 6, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ marginTop: 20 }}>
                    { this.renderButtonGenerate(this.insertGeneratedTirage, 'Enregistrer le tirage', this.state.isGenerate) }
                </View>
                <View style={{ flexDirection:"row", justifyContent: 'center', marginTop: 20 }}>
                    <Text style={ styles.numberCircle }> { this.state.tirage.chiffres[0] }</Text>
                    <Text style={ styles.numberCircle }> { this.state.tirage.chiffres[1] }</Text>
                    <Text style={ styles.numberCircle }> { this.state.tirage.chiffres[2] }</Text>
                    <Text style={ styles.numberCircle }> { this.state.tirage.chiffres[3] }</Text>
                    <Text style={ styles.numberCircle }> { this.state.tirage.chiffres[4] }</Text>
                    <Text style={ styles.numberSquare }> { this.state.tirage.etoiles[0] }</Text>
                    <Text style={ styles.numberSquare }> { this.state.tirage.etoiles[1] }</Text>
                </View>
                <View style={{ marginTop: 20 }}>
                    { this.renderButtonGenerate(this.randomTirage, 'Générer un tirage aléatoire', true) }
                </View>
            </View>
        );
    }

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

const styles = StyleSheet.create({
    bigblue: {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: 30,
    },
    red: {
        color: 'red',
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