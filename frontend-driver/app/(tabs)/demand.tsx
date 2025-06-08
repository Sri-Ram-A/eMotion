import { Text, View,  StyleSheet, TextInput,Button,ActivityIndicator,Alert } from 'react-native';
import React,{useState} from 'react';
import { Link } from 'expo-router';
import handleSubmit from '@/services/routes';
import * as types from "@/types"
export default function Index() {
  const [source ,setSource]=useState("")
  const [result,setResult]=useState<types.PredictionData>()
  const [isLoading, setIsLoading] = useState<Boolean>(false)
  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const data = await handleSubmit(null as unknown as void, `demand/${source}`, 'GET')
      setResult(data)
    } catch (error) {
      Alert.alert("Error", "Error fetching");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>demand screen</Text>
      <TextInput
      placeholder='Enter source'
      onChangeText={setSource}
      value={source}
      />
      {isLoading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <Button title="Login" onPress={onSubmit} />
      )}
      {result && <Text style={styles.text}>{JSON.stringify(result)}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});
