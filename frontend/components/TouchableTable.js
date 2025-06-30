import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export const TouchableTable = ({
    tableData = [], // Default empty array
    colMetaData = [],
    handleClickTable,
}) => {
    const renderItem = ({ item, index }) => {
        return (
            item.showrow && (
                <TouchableOpacity style={styles.row} onPress={() => handleClickTable(index)}>
                    {item.table_value.map((tdata, tindex) => (
                        <View key={tdata.t_key} style={styles.cell}>
                            <Text style={{ color: "white" }}>
                                {tdata.t_value.length > 15
                                    ? tdata.t_value.substring(0, 15) + "..."
                                    : tdata.t_value}
                            </Text>

                        </View>
                    ))}
                </TouchableOpacity>
            )
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                {
                    colMetaData.map(item => (
                        <Text key={item.h_colindex} style={styles.headerCell}>{item.h_name}</Text>
                    ))
                }
            </View>

            {tableData.length > 0 ? (
                <FlatList
                    data={tableData}
                    keyExtractor={(item, index) => `list${index}`}
                    renderItem={renderItem}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No data available</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: 'gray',
        padding: 10,
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    cell: {
        flex: 1,
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
});
