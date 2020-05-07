declare var documentsData: Array<{
	data: Number, 
	label: String, 
	details: String, 
	type: String, 
	documentation: String | {
		type: String, 
		value: Array<String>
	}
}>;