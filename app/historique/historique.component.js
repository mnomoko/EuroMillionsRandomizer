import React, { Component } from 'react';
import {BackHandler, FlatList, StyleSheet, Text, View} from 'react-native';
import Swipeout from 'react-native-swipeout';

import { Tirage } from "../commons/tirage";
import {SQLite} from "expo";

import 'prop-types';
import {Icon} from "native-base";

const db = SQLite.openDatabase('db.db');

export class HistoriqueComponent extends Component {

    state = {
        tirages: [],
        activeRow: null
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
                tirage.id = t['id'];
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

    deleteById = async(id) => {
        await this.executeSql('delete from tirage where id = ?', [id]);
    };

    deleteItem = (tirage) => {
        this.selectById(tirage.id).then(() => {
            this.deleteById(tirage.id).then(() => {
                this.select();
            });
        });
    };

    selectById = async(id) => {
        await this.executeSql('select * from tirage where id = ?', [id, ]);
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

    onSwipeOpen(item, rowId, direction) {
        this.setState({ activeRow: item.id });
    }

    onSwipeClose(item, rowId, direction) {
        if (item.noteId === this.state.activeRow && typeof direction !== 'undefined') {
            this.setState({ activeRow: null });
        }
    }

    onDeleteItem = (item) => {
        this.deleteItem(item);
    };

    _renderItem = ({item: tirage}) => {
        const swipeBtns = [
            {
                component: (
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <Icon name="trash" size={35}/>
                    </View>
                ),
                backgroundColor: '#ff0500',
                underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
                onPress: () => {
                    this.onDeleteItem(tirage);
                },
            },
        ];

        const swipeSettings = {
            autoClose: true,
            close: tirage.id !== this.state.activeRow,
            onClose: (secId, rowId, direction) => this.onSwipeClose(tirage, rowId, direction),
            onOpen: (secId, rowId, direction) => this.onSwipeOpen(tirage, rowId, direction),
            right: [
                {onPress: () => this.onDeleteItem(tirage), text: 'Delete', type: 'delete', icon: 'trashcan'}
            ],
            right: swipeBtns,
            rowId: tirage.id,
            sectionId: 1
        };

        return (
            <View>
                <Swipeout {...swipeSettings}>
                    <View style={{flexDirection: "row", justifyContent: 'center', marginTop: 20, marginBottom: 20}}>
                        <Text style={styles.numberCircle}> {tirage.chiffres[0]}</Text>
                        <Text style={styles.numberCircle}> {tirage.chiffres[1]}</Text>
                        <Text style={styles.numberCircle}> {tirage.chiffres[2]}</Text>
                        <Text style={styles.numberCircle}> {tirage.chiffres[3]}</Text>
                        <Text style={styles.numberCircle}> {tirage.chiffres[4]}</Text>
                        <Text style={styles.numberSquare}> {tirage.etoiles[0]}</Text>
                        <Text style={styles.numberSquare}> {tirage.etoiles[1]}</Text>
                    </View>
                </Swipeout>
            </View>
        )

    };

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
        marginTop: 2,
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