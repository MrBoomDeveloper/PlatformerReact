import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Button, Toggle, Input, Header } from "@components";
import { sizes, colors } from "@util/variables";
import GameNative from "../../GameNative";
import Dialog from "./Dialog";
import settings from "@data/SettingsData"

export default function Settings({visible, onClose}) {
	const [localSettings, setLocalSettings] = useState(settings);
	
	useEffect(() => {
		GameNative.getKeys(settings, setLocalSettings);
	}, []);
	
	const renderItem = ({item, index}) => {
		return <Setting item={item} onUpdate={(newValue) => {
			const newSettings = localSettings;
			newSettings[index].initial = newValue;
			setLocalSettings(newSettings);
		}} />
	}
	
	return (
		<Dialog visible={visible} onClose={onClose}>
			<Header title="Settings" onClose={onClose} />
			<FlatList data={localSettings} renderItem={renderItem} style={styles.list} />
		</Dialog>
	);
}

function Setting({item, onUpdate}) {
	return (
		<View style={styles.setting}>
			<View style={styles.info}>
				<Text style={styles.title}>{item.title}</Text>
				{item.description && <Text style={styles.description}>{item.description}</Text>}
			</View>
			<Controller {...item} onUpdate={onUpdate} defaultValue={item.initial} />
		</View>
	);
}

function Controller({id, type, defaultValue, onUpdate}) {
	const [error, setError] = useState("");
	
	const onToggle = (newValue) => {
		onUpdate(newValue);
		GameNative.setKey(id, String(newValue), "boolean");
	}
	
	const onChangeText = (newText) => {
		if(newText != "" && /^\d+$/.test(newText.toString())) {
			setError("");
			onUpdate(newText);
			GameNative.setKey(id, newText, "number");
		} else {
			setError("Invalid value!");
		}
	}
	
	switch(type) {
		case "boolean":
			return (
				<Toggle onToggle={onToggle}
					defaultValue={defaultValue}
					style={{ marginRight: 8 }}/>
			);
		case "number":
			return (
				<Input error={error}
					onChangeText={onChangeText}
					defaultValue={defaultValue}
					style={styles.input} />
			);
	}
}

const styles = StyleSheet.create({
	list: {
		paddingTop: 15
	},
	
	setting: {
		display: "flex",
		alignItems: "center",
		paddingRight: 15,
		flexDirection: "row",
		margin: 25,
		marginTop: 10,
		marginBottom: 0,
		gap: 25,
		backgroundColor: colors.surfaceLight
	},
	
	info: {
		padding: 15,
		display: "flex",
		flexGrow: 1,
		gap: 8
	},
	
	title: {
		fontSize: 15,
		color: "white"
	},
	
	description: {
		fontSize: 13
	},
	
	input: {
		marginTop: 10,
		marginBottom: 10
	}
});