import React, { useState,useContext } from 'react';
import { TextInput, Button, ScrollView, ActivityIndicator, Text } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from "expo-secure-store"

import handleSubmit from '@/services/routes';
import * as types from "@/types"
import { IDContext } from "@/Context"; 

const RegisterScreen = () => {
	const [formData, setFormData] = useState<types.RegisterFormData>({
		name: '', email: '', phone_number: '', vehicle_year: '', vehicle_plate: '', driving_license: ''
	});
	const [isLoading, setIsLoading] = useState(false);
	const [response, setResponse] = useState<any>(null);
	const { id,setId } = useContext(IDContext);


	const handleChange = (key: keyof typeof formData, value: string) => {
		setFormData({ ...formData, [key]: value });
	};

	const onSubmit = async () => {
		setIsLoading(true);
		try {
			const data = await handleSubmit(formData, 'register/');
			setResponse(data);
			for (const key in data) {
				await SecureStore.setItemAsync(String(key), String(data[key]));
			}
			if (data.id) {	setId(data.id);	}
			console.info(`[REGSITER] Registered : ${data}`)
			// Use setTimeout to ensure navigation happens after state updates
			setTimeout(() => {router.replace('/')}, 0);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ScrollView contentContainerStyle={{ padding: 20 }}>
			<TextInput
				placeholder="Name"
				value={formData.name}
				onChangeText={(text) => handleChange('name', text)}
			/>
			<TextInput
				placeholder="Email"
				keyboardType="email-address"
				value={formData.email}
				onChangeText={(text) => handleChange('email', text)}
			/>
			<TextInput
				placeholder="Phone Number"
				keyboardType="phone-pad"
				maxLength={10}
				value={formData.phone_number}
				onChangeText={(text) => handleChange('phone_number', text)}
			/>
			<TextInput
				placeholder="Vehicle Year"
				keyboardType="number-pad"
				maxLength={4}
				value={formData.vehicle_year}
				onChangeText={(text) => handleChange('vehicle_year', text)}
			/>
			<TextInput
				placeholder="Vehicle Plate"
				value={formData.vehicle_plate}
				onChangeText={(text) => handleChange('vehicle_plate', text)}
			/>
			<TextInput
				placeholder="Driving License"
				value={formData.driving_license}
				onChangeText={(text) => handleChange('driving_license', text)}
			/>
			<Text>
				Response received : {JSON.stringify(response, null, 2)}
			</Text>

			{isLoading ? (
				<ActivityIndicator size="small" color="#0000ff" />
			) : (
				<Button title="Register" onPress={onSubmit} />
			)}
		</ScrollView>
	);
};

export default RegisterScreen;