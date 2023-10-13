type Data = {
	[key: symbol]: any
}
export const getValueBySymbolName = (symbolName: string) => (data: Data) => {
	const key = Object.getOwnPropertySymbols(data).find(
		(symbol) => Symbol(symbolName).toString() === symbol.toString()
	)

	return data[key as symbol]
}
