import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet, ScrollView } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { DataTable } from 'react-native-paper';
import io from "socket.io-client";

import result from './data.json'

const App = () => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(result.result);
  const [webSocketData, setWebSocketData] = useState({})
  // console.log(data);
  const headTable =  ['Head1', 'Head2', 'Head3']
  var ws = React.useRef(new WebSocket('wss://production-esocket.delta.exchange')).current;



  // useEffect(() => {
  //   const symbolArray=data.map((item) => item.symbol)
  //   ws.onopen = () => {
  //       console.log('viswa-Connected to the server')
  //       ws.send(JSON.stringify({
  //         "type": "subscribe",
  //         "payload": {
  //             "channels": [
  //                 {
  //                     "name": "v2/ticker",
  //                     "symbols": symbolArray
  //                 },
  //             ]
  //         }
  //     }
  //     ));
  //   }
  //   ws.onmessage = (e) => console.log('viswa-onmessage',JSON.parse(e.data))
  //   ws.onerror = (e) => console.log('viswa-Connected to the server-error',e.message)

  // })

  useEffect(() => {
    //  fetch('https://api.delta.exchange/v2/products')
    //   .then((response) => response.json())
    //   .then((json) => {
    //     if(json && json.result) {
    //       const data = json.result
    //       setData(data)
    //     }
    //   })
    //   .catch((error) => console.error(error))
    //   .finally(() => setLoading(false));
      const symbolArray= data.map((item) => item.underlying_asset.symbol)
      let uniqueChars = symbolArray.filter((c, index) => {
        return symbolArray.indexOf(c) === index;
    });
      ws.onopen = () => {
          console.log('viswa-Connected to the server')
          ws.send(JSON.stringify({
            "type": "subscribe",
            "payload": {
                "channels": [
                    {
                        "name": "v2/ticker",
                        "symbols": ["BTCUSD", "BTCUSDT"]                    
                    },
                ]
            }
        })
        );
      }
      ws.onmessage = (e) => {
        setWebSocketData(JSON.parse(e.data))
        console.log('viswa-e.data',JSON.parse(e.data))
      }
      ws.onerror = (e) => console.log('viswa-Connected to the server-error',e.message)
      // let resultArray = []
      // resultArray = data.map((item) => item.markPrice = webSocketData.mark_price)
      // console.log('viswa-resultArray', resultArray)
  },[data,webSocketData]);
  // console.log('viswa-webSocketData', webSocketData)

  return (
    <View style={styles.container}>
      <DataTable>
        <DataTable.Header style={styles.headStyle}>
        <View style={styles.cellContainer}>
            <Text style={styles.headingTextStyle}>Symbol</Text>
          </View>
          <View style={styles.cellContainer}>
            <Text style={styles.headingTextStyle} numberOfLines={1}>
              Description
            </Text>
          </View>
          <View style={styles.cellContainer}>
            <Text style={styles.headingTextStyle}>Underlying Asset</Text>
          </View>
          <View style={styles.cellContainer}>
            <Text style={styles.headingTextStyle}>Mark Price</Text>
          </View>
        </DataTable.Header>
        <FlatList
            data={data}
            keyExtractor={({ id }, index) => id}
            renderItem={({ item }) => (
              <DataTable.Row style={{ height: 120}}>
                <View style={styles.cellContainer}>
                  <Text style={styles.cellTextStyle}>{item.symbol}</Text>
                </View>
                <View style={styles.cellContainer}>
                  <Text style={styles.cellTextStyle}>{item.description}</Text>
                </View>
                <View style={styles.cellContainer}>
                  <Text style={styles.cellTextStyle}>{item.underlying_asset.symbol}</Text>
                </View>
                <View style={styles.cellContainer}>
                  <Text style={styles.cellTextStyle}>{webSocketData.mark_price}</Text>
                </View>
              </DataTable.Row>
            )}
          />
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headStyle: { 
    height: 60,
  },
  cellContainer: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#efefef',
    padding: 5
    // alignItems: 'center'
  },
  headingTextStyle: {
    fontSize: 16,
    color: '#000',
  },
  cellTextStyle: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold'
  }

});


export default App;