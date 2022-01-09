import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { DataTable } from 'react-native-paper';


const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [webSocketData, setWebSocketData] = useState({})
  var ws = React.useRef(new WebSocket('wss://production-esocket.delta.exchange')).current;

  useEffect(() => {
     fetch('https://api.delta.exchange/v2/products')
      .then((response) => response.json())
      .then((json) => {
        if(json && json.result) {
          const data = json.result
=          setData(data)
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
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
      }
      ws.onerror = (e) => console.log('viswa-Connected to the server-error',e.message)
  },[data,webSocketData]);

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
            renderItem={({ item }) => 
            (
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
            ListEmptyComponent={
              <View style={{
                flex: 1,
                padding: 40,
                alignItems: 'center'
              }}>
                <Text style={styles.cellTextStyle}>Loading...</Text>
              </View>
              }
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